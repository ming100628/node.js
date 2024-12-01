const { createServer } = require("node:http");
var fs = require("fs");
var os = require("os");
const hostname = "127.0.0.1";
const port = 3000;

function getAllFileNames() {
  return fs.readdirSync("./public/");
}

function getFileData(filepath) {
  return fs.readFileSync(filepath, "utf8");
}

const server = createServer(async (req, res) => {
  var s = "";
  if (req.url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    await fs.readdir("./public/", (err, files) => {
      files.forEach((file) => {
        res.write(`<a href="/${file}/">${file}</a>`);
        res.write("<br/>");
      });
      res.end();
    });
  } else {
    var fileNames = getAllFileNames();
    const urlFileName = req.url.substring(1, req.url.length - 1);
    if (fileNames.some((fileName) => urlFileName === fileName)) {
      const fileContent = getFileData(`./public/${urlFileName}`);
      res.write(fileContent);
    } else {
      res.statusCode = 404;
    }
    res.end();
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
