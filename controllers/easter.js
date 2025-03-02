import easter from "../views/easter.html.js";
export default {
  GET: async function (req, res) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.write(easter());
    res.end();
  },
};
