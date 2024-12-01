const { createServer } = require("node:http");
var fs = require("fs");
var os = require("os");
const hostname = "127.0.0.1";
const port = 3000;

async function getAllFileNames() {
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
    var fileNames = await getAllFileNames();
    var foundFile = false;
    fileNames.forEach(async (file) => {
      if (req.url.substring(1, req.url.length - 1) == file) {
        const fileContent = getFileData(`./public/${file}`);
        console.log(fileContent);
        res.write(fileContent);
        foundFile = true;
        res.end();
      }
    });
    if (!foundFile) {
      res.statusCode = 404;
      res.end();
    }
  }
  // res.end(s);
  // res.end(`${new Date()}`);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
