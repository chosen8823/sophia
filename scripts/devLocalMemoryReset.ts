import { globalMemory } from "../src/lib/memory/MemoryLattice.ts";

// Simple script placeholder (non-functional in Next runtime directly) – pattern for future CLIs.
export function resetMemory() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore accessing private for quick dev utility
  globalMemory.entries = [];
  console.log("Memory lattice cleared.");
}

if (require.main === module) {
  resetMemory();
}
