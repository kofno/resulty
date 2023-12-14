import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    deno: true,
  },
  package: {
    // package.json properties
    name: "resulty",
    version: Deno.args[0],
    description: "A return type for computations that may fail",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/kofno/resulty.git",
    },
    bugs: {
      url: "https://github.com/kofno/resulty/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("readme.md", "npm/readme.md");
  },
});
