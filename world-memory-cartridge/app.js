const state = {
  manifest: null,
  middleware: null,
  phase: 0,
};

async function loadManifest() {
  state.manifest = await loadCartridgeArtifact();
  state.middleware = await loadMiddleware();
  hydrateText();
  renderMiddleware();
  renderMirrors();
  requestAnimationFrame(drawLoop);
}

async function loadCartridgeArtifact() {
  try {
    const response = await fetch("./world-memory.wmc");
    if (!response.ok) {
      throw new Error(`Unable to load .wmc artifact: ${response.status}`);
    }
    return JSON.parse(await response.text());
  } catch (_error) {
    const fallback = await fetch("./memory-manifest.json");
    if (!fallback.ok) {
      throw new Error(`Unable to load fallback manifest: ${fallback.status}`);
    }
    return fallback.json();
  }
}

async function loadMiddleware() {
  const middlewarePath = state.manifest?.paths?.middleware || "./middleware/agent-middleware.json";
  const response = await fetch(middlewarePath);
  if (!response.ok) {
    throw new Error(`Unable to load middleware: ${response.status}`);
  }
  return response.json();
}

function hydrateText() {
  const manifest = state.manifest;
  document.getElementById("world-rule").textContent = manifest.projectionCore.worldRule;
  document.getElementById("local-command").textContent = manifest.launch.local.command;
  document.getElementById("container-command").textContent = manifest.launch.container.command;
  document.getElementById("artifact-path").textContent = manifest.paths.artifact;

  const pathList = document.getElementById("path-list");
  pathList.innerHTML = Object.entries(manifest.paths)
    .map(
      ([key, value]) => `
        <div class="path-row">
          <strong>${labelise(key)}</strong>
          <span>${escapeHtml(value)}</span>
        </div>
      `
    )
    .join("");

  const specGrid = document.getElementById("spec-grid");
  specGrid.innerHTML = Object.entries(manifest.specs)
    .map(([key, value]) => {
      const renderedValue = Array.isArray(value) ? value.join(" / ") : String(value);
      return `
        <div>
          <dt>${labelise(key)}</dt>
          <dd>${escapeHtml(renderedValue)}</dd>
        </div>
      `;
    })
    .join("");
}

function renderMirrors() {
  const mirrorGrid = document.getElementById("mirror-grid");
  mirrorGrid.innerHTML = state.manifest.mirrors
    .map(
      (mirror) => `
        <article class="mirror-card">
          <h3>${escapeHtml(mirror.label)}</h3>
          <div class="mirror-kind">${escapeHtml(mirror.kind)}</div>
          <p class="mirror-meta">${escapeHtml(mirror.role)}</p>
          <p class="mirror-meta">
            <strong>Path</strong><br />
            ${escapeHtml(mirror.path)}
          </p>
          <p class="mirror-meta">
            <strong>Latency</strong><br />
            ${escapeHtml(mirror.latency)}
          </p>
          <div class="mirror-status">${escapeHtml(mirror.status)}</div>
        </article>
      `
    )
    .join("");
}

function renderMiddleware() {
  const middleware = state.middleware;
  const summary = document.getElementById("middleware-summary");
  summary.innerHTML = [
    {
      label: "Roots",
      value: middleware.roots.length,
    },
    {
      label: "Specialists",
      value: middleware.specialists.length,
    },
    {
      label: "Queues",
      value: Object.keys(middleware.queues).length,
    },
  ]
    .map(
      (item) => `
        <div class="middleware-card">
          <strong>${escapeHtml(item.label)}</strong>
          <span class="middleware-value">${escapeHtml(item.value)}</span>
        </div>
      `
    )
    .join("");

  const rootList = document.getElementById("root-list");
  rootList.innerHTML = middleware.roots
    .map(
      (root) => `
        <article class="root-card">
          <h3>${escapeHtml(root.label)}</h3>
          <div class="mirror-kind">${escapeHtml(root.mode)}</div>
          <p>${escapeHtml(root.role)}</p>
          <p><strong>Path</strong><br />${escapeHtml(root.path)}</p>
          ${root.caution ? `<p><strong>Caution</strong><br />${escapeHtml(root.caution)}</p>` : ""}
        </article>
      `
    )
    .join("");

  const specialistList = document.getElementById("specialist-list");
  specialistList.innerHTML = middleware.specialists
    .map(
      (specialist) => `
        <article class="specialist-card">
          <h3>${escapeHtml(specialist.label)}</h3>
          <div class="mirror-kind">${escapeHtml(specialist.id)}</div>
          <div class="tag-row">
            ${specialist.handles
              .map((item) => `<span class="tag">${escapeHtml(item)}</span>`)
              .join("")}
          </div>
        </article>
      `
    )
    .join("");
}

function drawLoop() {
  state.phase += 0.01;
  drawCartridge();
  requestAnimationFrame(drawLoop);
}

function drawCartridge() {
  const canvas = document.getElementById("cartridge-canvas");
  const context = canvas.getContext("2d");
  const { width, height } = canvas;
  const centreX = width / 2;
  const centreY = height / 2;

  context.clearRect(0, 0, width, height);

  const background = context.createRadialGradient(
    centreX,
    centreY,
    50,
    centreX,
    centreY,
    width * 0.48
  );
  background.addColorStop(0, "rgba(247, 178, 103, 0.08)");
  background.addColorStop(0.4, "rgba(123, 223, 242, 0.05)");
  background.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  if (!state.manifest) {
    return;
  }

  context.save();
  context.translate(centreX, centreY);

  for (const ring of state.manifest.geometry.rings) {
    const radius = ring.radius * width * 0.5;
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.strokeStyle = ring.hue;
    context.globalAlpha = 0.28;
    context.lineWidth = 2;
    context.stroke();

    context.beginPath();
    context.arc(0, 0, radius + Math.sin(state.phase * 3 + radius * 0.001) * 6, 0, Math.PI * 2);
    context.globalAlpha = 0.12;
    context.stroke();
  }

  context.globalAlpha = 1;

  for (const mirror of state.manifest.mirrors) {
    const index = state.manifest.mirrors.indexOf(mirror);
    const angle = ((Math.PI * 2) / state.manifest.mirrors.length) * index - Math.PI / 2;
    const radius = width * 0.32;
    const x = Math.cos(angle + state.phase * 0.1) * radius;
    const y = Math.sin(angle + state.phase * 0.1) * radius;

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(x, y);
    context.strokeStyle = "rgba(123, 223, 242, 0.18)";
    context.lineWidth = 1.4;
    context.stroke();

    const glow = context.createRadialGradient(x, y, 2, x, y, 42);
    glow.addColorStop(0, "rgba(184, 242, 230, 0.95)");
    glow.addColorStop(1, "rgba(184, 242, 230, 0)");
    context.fillStyle = glow;
    context.beginPath();
    context.arc(x, y, 42, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#b8f2e6";
    context.beginPath();
    context.arc(x, y, 12, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#eef7fb";
    context.font = "16px Palatino Linotype";
    context.textAlign = "center";
    context.fillText(mirror.label, x, y - 22);
  }

  for (const node of state.manifest.geometry.nodes) {
    const ring = state.manifest.geometry.rings[node.ring];
    const radius = ring.radius * width * 0.5;
    const angle = (node.angle * Math.PI) / 180 + state.phase * 0.18 * node.weight;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    context.beginPath();
    context.arc(x, y, 8 + node.weight * 10, 0, Math.PI * 2);
    context.fillStyle = ring.hue;
    context.globalAlpha = 0.92;
    context.fill();

    context.fillStyle = "#eef7fb";
    context.globalAlpha = 0.9;
    context.font = "13px Palatino Linotype";
    context.textAlign = "center";
    context.fillText(node.label, x, y + 28);
  }

  const coreGlow = context.createRadialGradient(0, 0, 8, 0, 0, 140);
  coreGlow.addColorStop(0, "rgba(247, 178, 103, 1)");
  coreGlow.addColorStop(0.46, "rgba(123, 223, 242, 0.42)");
  coreGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = coreGlow;
  context.globalAlpha = 1;
  context.beginPath();
  context.arc(0, 0, 140, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#f7b267";
  context.beginPath();
  context.arc(0, 0, 34 + Math.sin(state.phase * 2.6) * 3, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#082033";
  context.font = "700 18px Palatino Linotype";
  context.textAlign = "center";
  context.fillText("Core", 0, -6);
  context.font = "14px Palatino Linotype";
  context.fillText("Project", 0, 16);

  context.restore();
}

function labelise(value) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  })[character]);
}

loadManifest().catch((error) => {
  console.error(error);
  document.getElementById("world-rule").textContent = "Manifest unavailable";
});
