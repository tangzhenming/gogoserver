#!/usr/bin/env node
const { Command } = require("commander");
const http = require("http");
const fs = require("fs");
const path = require("path");
const template = require("art-template");

const server = http.createServer();
let port;

function startService(userPath) {
  const cwd = process.cwd();
  const completePath = path.join(cwd, userPath);
  const stats = fs.statSync(completePath);

  if (stats.isDirectory()) {
    // --path 指定目录
    const allFiles = fs.readdirSync(completePath);
    const isEmptyDir = allFiles.length === 0;
    const fileData = allFiles.map((file) => {
      return {
        name: file,
        path: path.join(completePath, file),
      };
    });

    server.on("request", (req, res) => {
      fs.readFile(path.join(__dirname, "./index.html"), (err, data) => {
        if (err || isEmptyDir) return res.end("404");
        const htmlStr = template.render(data.toString(), {
          fileData,
        });
        res.end(htmlStr);
      });
    });
  } else {
    // --path 指定文件
    const fileSizeInBytes = stats.size;
    server.on("request", (req, res) => {
      const stream = fs.createReadStream(completePath, "utf8");
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
  .action(({ port: userPort, path: userPath }) => {
    port = userPort || 3000;
    startService(userPath || "");
  });
program.parse(process.argv);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
