#!/usr/bin/env node
const { Command } = require("commander");
const http = require("http");
const fs = require("fs");
const fsp = require("fs").promises;
const path = require("path");
const template = require("art-template");

const server = http.createServer();
let port;

async function startService(userPath) {
  const cwd = process.cwd();
  const completePath = path.join(cwd, userPath);
  const stats = await fsp.stat(completePath);

  if (stats.isDirectory()) {
    // --path 指定目录
    const allFiles = await fsp.readdir(completePath);
    const isEmptyDir = allFiles.length === 0;
    const fileData = allFiles.map((file) => {
      return {
        name: file,
        path: path.join(completePath, file),
      };
    });

    server.on("request", async (req, res) => {
      const html = await fsp.readFile(path.join(__dirname, "./index.html"));
      if (!html || isEmptyDir) return res.end("404");
      const htmlStr = template.render(html.toString(), {
        fileData,
      });
      res.end(htmlStr);
    });
  } else {
    // --path 指定文件
    const fileSizeInBytes = stats.size;
    server.on("request", (req, res) => {
      const stream = fs.createReadStream(completePath);
      res.writeHead(200, {
        "Content-Length": fileSizeInBytes,
      });
      stream.pipe(res);
    });
  }
}

const program = new Command();
program.name("gogoserver").description("CLI to start a server");
program
  .command("serve")
  .description("start service")
  .option("--port <number>", "port to start server on")
  .option("--path <path>", "path to serve")
  .action(async ({ port: userPort, path: userPath }) => {
    port = userPort || 3000;
    startService(userPath || "");
  })
  .parse(process.argv);

server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
