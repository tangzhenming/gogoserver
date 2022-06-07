#!/usr/bin/env node
const { Command } = require("commander");
const http = require("http");

function startService(port) {
  const server = http.createServer((req, res) => {});
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

const program = new Command();
program.name("gogoserver").description("CLI to start a server");
program
  .command("serve")
  .description("start service")
  .option("-p, --port <number>", "port to start server on")
  .action(({ port }) => {
    startService(port || 3000);
  });
program.parse(process.argv);
