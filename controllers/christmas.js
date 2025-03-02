import christmas from "../views/christmas.html.js";
export default {
  GET: function (req, res) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.write(christmas());
    res.end();
  },
};
