const fs = require("fs/promises");
const path = require("path");

const DEFAULT_EXCLUDES = new Set([
  ".git",
  ".venv",
  ".vs",
  ".vscode",
  ".pytest_cache",
  ".mypy_cache",
  "__pycache__",
  "coverage",
  "node_modules",
  "logs",
]);

const TEXT_EXTENSIONS = new Set([
  ".c",
  ".cs",
  ".css",
  ".csv",
  ".html",
  ".ini",
  ".js",
  ".json",
  ".jsx",
  ".lua",
  ".md",
  ".mjs",
  ".ps1",
  ".py",
  ".rb",
  ".sh",
  ".sql",
  ".svg",
  ".toml",
  ".ts",
  ".tsx",
  ".txt",
  ".xml",
  ".yaml",
  ".yml",
]);

function toPosix(relativePath) {
  return relativePath.split(path.sep).join("/");
}

function isInsideRoot(rootDir, targetPath) {
  const relative = path.relative(rootDir, targetPath);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function shouldExclude(name) {
  return (
    DEFAULT_EXCLUDES.has(name) ||
    name.endsWith(".log") ||
    name.endsWith(".pid") ||
    name.endsWith(".pyc")
  );
}

function isTextLike(filePath) {
  return TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

async function buildTree(rootDir, options = {}) {
  const resolvedRoot = path.resolve(rootDir);
  const maxDepth = Number(options.maxDepth || 4);
  const maxEntriesPerDirectory = Number(options.maxEntriesPerDirectory || 80);

  const summary = {
    directories: 0,
    files: 0,
    truncatedDirectories: 0,
  };

  async function walk(currentPath, depth) {
    const stats = await fs.stat(currentPath);
    const relativePath = path.relative(resolvedRoot, currentPath);
    const displayPath = relativePath ? toPosix(relativePath) : ".";

    if (stats.isDirectory()) {
      summary.directories += 1;

      const node = {
        name: path.basename(currentPath),
        path: displayPath,
        type: "directory",
        size: stats.size,
        modifiedAt: stats.mtime.toISOString(),
        children: [],
        truncated: false,
        hiddenChildren: 0,
      };

      if (depth >= maxDepth) {
        node.truncated = true;
        summary.truncatedDirectories += 1;
        return node;
      }

      const entries = await fs.readdir(currentPath, { withFileTypes: true });
      const filtered = entries
        .filter((entry) => !shouldExclude(entry.name))
        .sort((left, right) => {
          const leftDirectory = left.isDirectory() ? 0 : 1;
          const rightDirectory = right.isDirectory() ? 0 : 1;
          if (leftDirectory !== rightDirectory) {
            return leftDirectory - rightDirectory;
          }
          return left.name.localeCompare(right.name);
        });

      const visibleEntries = filtered.slice(0, maxEntriesPerDirectory);
      node.hiddenChildren = Math.max(0, filtered.length - visibleEntries.length);

      for (const entry of visibleEntries) {
        if (entry.isSymbolicLink()) {
          continue;
        }

        node.children.push(await walk(path.join(currentPath, entry.name), depth + 1));
      }

      if (node.hiddenChildren > 0) {
        node.truncated = true;
        summary.truncatedDirectories += 1;
      }

      return node;
    }

    summary.files += 1;

    return {
      name: path.basename(currentPath),
      path: displayPath,
      type: "file",
      size: stats.size,
      modifiedAt: stats.mtime.toISOString(),
      extension: path.extname(currentPath).toLowerCase(),
      textLike: isTextLike(currentPath),
    };
  }

  const tree = await walk(resolvedRoot, 0);

  return {
    root: resolvedRoot,
    generatedAt: new Date().toISOString(),
    summary,
    tree,
  };
}

async function readFilePreview(rootDir, relativePath, options = {}) {
  const resolvedRoot = path.resolve(rootDir);
  const candidate = path.resolve(resolvedRoot, relativePath || ".");

  if (!isInsideRoot(resolvedRoot, candidate)) {
    throw new Error("Path escapes wiki root");
  }

  const stats = await fs.stat(candidate);
  const previewBytes = Number(options.previewBytes || 12000);

  if (stats.isDirectory()) {
    const entries = await fs.readdir(candidate, { withFileTypes: true });
    const children = entries
      .filter((entry) => !shouldExclude(entry.name))
      .slice(0, 40)
      .map((entry) => ({
        name: entry.name,
        type: entry.isDirectory() ? "directory" : "file",
      }));

    return {
      path: toPosix(path.relative(resolvedRoot, candidate) || "."),
      type: "directory",
      size: stats.size,
      modifiedAt: stats.mtime.toISOString(),
      children,
      preview: "",
      truncated: entries.length > children.length,
    };
  }

  const filePath = toPosix(path.relative(resolvedRoot, candidate));

  if (!isTextLike(candidate)) {
    return {
      path: filePath,
      type: "file",
      size: stats.size,
      modifiedAt: stats.mtime.toISOString(),
      preview: "",
      textLike: false,
      truncated: false,
    };
  }

  const handle = await fs.open(candidate, "r");
  const buffer = Buffer.alloc(previewBytes);
  const { bytesRead } = await handle.read(buffer, 0, previewBytes, 0);
  await handle.close();

  const preview = buffer
    .subarray(0, bytesRead)
    .toString("utf8")
    .replace(/\r\n/g, "\n");

  return {
    path: filePath,
    type: "file",
    size: stats.size,
    modifiedAt: stats.mtime.toISOString(),
    preview,
    textLike: true,
    truncated: stats.size > bytesRead,
  };
}

module.exports = {
  buildTree,
  readFilePreview,
};
