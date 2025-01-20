import { createServer } from "node:http";

import fs from "fs";
import obj from "./routes.js";
const hostname = "127.0.0.1";
const port = 3000;
import { getComments, createDb, incrementCounter } from "./db.js";
function getAllFileNames() {
  return fs.readdirSync("./public/");
}

function getFileData(filepath) {
  return fs.readFileSync(filepath, "utf8");
}

const server = createServer(async (req, res) => {
  console.log(req.url);
  var s = "";
  const db = await createDb();
  await incrementCounter();
  let counter = await db.all("SELECT visit from counter LIMIT 1");

  if (req.url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    await fs.readdir("./public/", (err, files) => {
      files.forEach((file) => {
        res.write(`<a href="/${file}/">${file}</a>`);
        res.write("<br/>");
      });
      res.write(`visitors: ${counter[0].visit}`);
      res.end();
    });
  } else if (req.url === "/comments") {
    res.setHeader("Content-Type", "text/html");
    var comments = await getComments();
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      res.write(`<div>${comment.content}</div>`);
    }

    res.end();
  } else if (req.url == "/3333") {
    res.setHeader("Content-Type", "text/html");
    res.write(f());
    res.end();
  } else if (obj[req.url]) {
    res.setHeader("Content-Type", "text/html");
    // const fileContent = getFileData(`./views/${obj[req.url]}`);
    const f = await import(`./views/${obj[req.url]}`);
    console.log(f);
    res.write(f.default());
    res.write(`${counter[0].visit}`);
    res.end();
  } else {
    var fileNames = getAllFileNames();
    const urlFileName = req.url.substring(1, req.url.length - 1);
    if (fileNames.some((fileName) => urlFileName === fileName)) {
      const fileContent = getFileData(`./public/${urlFileName}`);
      res.setHeader("Content-Type", "application/download");
      res.setHeader("Content-Disposition", `filename=${urlFileName}`);
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
