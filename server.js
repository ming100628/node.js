import { createServer } from "node:http";
import bodyParser from "body-parser";

import fs from "fs";
import obj from "./routes.js";
const hostname = "127.0.0.1";
const port = 3000;
import {
  getComments,
  createDb,
  incrementCounter,
  createComments,
} from "./db.js";
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
  // console.log(req);
  console.log(req.method);
  if (req.method === "GET") {
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
      res.write(
        "<form action='/comments' method='post'><input name='comment' type='text' /><button>Submit</button></form>"
      );
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
  } else if (req.method === "POST") {
    // console.log(req.body);
    if (req.url === "/comments") {
      var chunks = [];
      req.on("data", (chunk) => {
        chunks.push(chunk);
      });
      var stringData;
      req.on("end", () => {
        const data = Buffer.concat(chunks);
        stringData = data.toString().split("=")[1];
      });
      const db2 = await createDb();
      await createComments(stringData);
      res.writeHead(302, { Location: "http://127.0.0.1:3000" + req.url });
      res.end();
    }
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
