const { createServer } = require("node:http");
var fs = require("fs");
var os = require("os");
const hostname = "127.0.0.1";
const port = 3000;

const server = createServer(async (req, res) => {
  var s = "";
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  await fs.readdir("./public/", (err, files) => {
    files.forEach((file) => {
      res.write(file);
      res.write("<br/>");
    });
    res.end();
  });
  // res.end(s);
  // res.end(`${new Date()}`);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
