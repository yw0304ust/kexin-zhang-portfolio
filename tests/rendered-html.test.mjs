import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders Kexin Zhang's portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>Kexin Zhang — Game Design &amp; Player Experience Research<\/title>/i,
  );
  assert.match(html, /Questions made playable/);
  assert.match(html, /Anchor/);
  assert.match(html, /Character Attachment/);
  assert.match(html, /FPS Playtime Study/);
  assert.match(html, /AI × Library Live Chat/);
  assert.match(html, /97 valid responses/);
  assert.match(html, /55 survey · 6 interviews/);
  assert.match(html, /Design as a way of asking/);
  assert.match(html, /Ruihi\.zhang@outlook\.com/);
});

test("ships the accessible single-viewport pager", async () => {
  const [response, css, source, visuals] = await Promise.all([
    render(),
    readFile(new URL("../app/pager.css", import.meta.url), "utf8"),
    readFile(new URL("../app/PortfolioPager.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ResearchVisuals.tsx", import.meta.url), "utf8"),
  ]);
  const html = await response.text();

  assert.match(html, /Skip to current page/);
  assert.match(html, /aria-label="Primary pages"/);
  assert.match(html, /aria-label="Page controls"/);
  assert.match(html, /aria-current="page"/);
  assert.match(html, /id="main-content"/);
  assert.match(html, /<dialog/);
  assert.match(html, /og:image/);
  assert.match(css, /backdrop-filter:\s*blur\(24px\)/);
  assert.match(css, /\.pager-screen\.is-active/);
  assert.match(css, /overflow:\s*hidden/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(source, /event\.key === "ArrowRight"/);
  assert.match(source, /event\.pointerType !== "touch"/);
  assert.match(source, /window\.history\.pushState/);
  assert.match(source, /dialog\.showModal\(\)/);
  assert.match(source, /ResearchVisuals/);
  assert.doesNotMatch(source, /600\+ valid responses|400 student responses/);
  assert.match(visuals, /scrollBy\(\{ left:/);
  assert.match(visuals, /Odds ratios and 95 percent confidence intervals/);
  assert.match(visuals, /Survey bases vary by question/);
  assert.equal(source.match(/pager-glass/g)?.length, 2);
  assert.match(css, /\.pager-home\s*\{[\s\S]*?background:\s*#121613/);
  assert.match(css, /\.pager-practice\s*\{[\s\S]*?background:\s*#202722/);
  assert.match(css, /\.pager-ambient\s*\{[\s\S]*?display:\s*none/);
  assert.match(css, /\.pager-app\s*\{[^}]*height:\s*100dvh/);
  assert.match(css, /\.pager-stage\s*\{\s*perspective:\s*none/);
  assert.match(css, /\.pager-screen-scroll\s*\{[^}]*overflow-y:\s*hidden/);
  assert.match(css, /grid-template-rows:\s*auto minmax\(0,\s*0\.48fr\) minmax\(0,\s*1\.52fr\) auto/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?grid-template-rows:\s*auto minmax\(0,\s*1fr\)/);
  assert.match(css, /grid-template-rows:\s*repeat\(4,\s*minmax/);
  assert.match(css, /scroll-snap-type:\s*x mandatory/);
  assert.match(css, /\.home-layout,[\s\S]*?height:\s*100%/);
  assert.match(css, /@media \(max-height: 500px\)/);
  assert.doesNotMatch(css, /\.pager-screen-scroll\s*\{[^}]*overflow-y:\s*auto/);
  assert.doesNotMatch(html, /codex-preview/);
  assert.doesNotMatch(html, /Your site is taking shape/);
  assert.doesNotMatch(html, /13990096118/);
});
