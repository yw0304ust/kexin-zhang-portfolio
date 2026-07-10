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
  assert.match(html, /FPS Playtime Study/);
  assert.match(html, /AI × Library Live Chat/);
  assert.match(html, /Design as a way of asking/);
  assert.match(html, /Ruihi\.zhang@outlook\.com/);
});

test("ships accessible navigation and no starter metadata", async () => {
  const [response, css] = await Promise.all([
    render(),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  const html = await response.text();

  assert.match(html, /Skip to content/);
  assert.match(html, /aria-label="Primary navigation"/);
  assert.match(html, /id="main-content"/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(html, /codex-preview/);
  assert.doesNotMatch(html, /Your site is taking shape/);
  assert.doesNotMatch(html, /13990096118/);
});
