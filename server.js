import { createServer } from "node:http";

import routes from "./routes.js";
const hostname = "127.0.0.1";
const port = 3000;

const server = createServer(async (req, res) => {
  let [_match, path, url_id, nestedPath, params] = req.url.match(
    /^(\/[^\/]+)\/?(\d+)?\/?(.*?)(\?.*)?$/
  );
  let controller;
  try {
    controller = routes[req.method][path][nestedPath];
  } catch (error) {
    controller;
  }
  if (controller) {
    controller(req, res, url_id, params);
  } else {
    res.write("<div>not found</div>");
    res.write(`<div>method: ${req.method}</div>`);
    res.write(`<div>url: ${req.url}</div>`);
    res.status = 404;
    res.end();
  }
});

server.listen(port, hostname, () => {
  console.log("server started");
});
