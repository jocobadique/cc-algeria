// node shoot.cjs 375,768,1366  -> full-page screenshots of preview.html in shots/
// Serves the folder locally so preview.html can fetch sample-monuments.json.
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const widths = (process.argv[2] || "375,768,1366").split(",").map(Number);
const types = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json" };

const server = http.createServer((req, res) => {
  const file = path.join(__dirname, decodeURIComponent(req.url.split("?")[0]).replace(/^\/$/, "/preview.html"));
  fs.readFile(file, (err, data) => {
    if (err) return res.writeHead(404).end();
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" }).end(data);
  });
});

server.listen(0, async () => {
  const url = `http://localhost:${server.address().port}/preview.html`;
  const browser = await chromium.launch();
  fs.mkdirSync(path.join(__dirname, "shots"), { recursive: true });
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.screenshot({ path: `shots/w${width}.png`, fullPage: true });
    await page.click(".cca-more");
    await page.waitForTimeout(400);
    await page.screenshot({ path: `shots/w${width}_popup.png` });
    await page.close();
  }
  await browser.close();
  server.close();
  console.log("saved", widths.map((w) => `shots/w${w}.png`).join(", "));
});
