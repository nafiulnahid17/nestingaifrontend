import { readFile, writeFile, rm } from "node:fs/promises";
import { renderHome } from "../.prerender/prerender.js";

const path = new URL("../dist/index.html", import.meta.url);
const html = await readFile(path, "utf8");
const marker = '<div id="root"></div>';
if (!html.includes(marker)) throw new Error("Prerender root not found");
const markup = renderHome();
if (!markup.includes("About Vexora AI") || !markup.includes("/about/")) throw new Error("Prerender brand content not found");
await writeFile(path, html.replace(marker, () => `<div id="root">${markup}</div>`));
await rm(new URL("../.prerender/", import.meta.url), { recursive: true, force: true });
console.log("Vexora AI homepage prerendered.");
