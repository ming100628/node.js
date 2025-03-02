import {
  getComments,
  createComments,
  deleteComments,
  getComment,
} from "./../db.js";
export default {
  GET: async function (req, res) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.write(
      "<form action='/comments' method='post'><input name='comment' type='text' /><button>Submit</button></form>"
    );
    var comments = await getComments();
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      res.write(
        `<div>${comment.content}
          <button onClick="fetch('/comments/${comment.id}', {method: 'DELETE', body: JSON.stringify({ id: ${comment.id} })}).then(()=> window.location.reload())">
            delete
          </button>
          <a href='/comments/${comment.id}/edit'>edit</a>
        </div>`
      );
    }

    res.end();
  },
  POST: async function (req, res) {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk.toString();
    });
    req.on("end", async () => {
      const [key, value] = data.split("=");
      await createComments(value);
    });
    res.writeHead(302, { Location: "http://127.0.0.1:3000" + req.url });
    res.end();
  },
  DELETE: async function (req, res, id) {
    // two different methods of getting the id, either through url path or json body
    // let data = "";
    // req.on("data", (chunk) => {
    //   data += chunk.toString();
    // });
    // req.on("end", async () => {
    //   const jsonBody = JSON.parse(data);
    //   deleteComments(jsonBody.id);
    // });
    await deleteComments(id);
    res.end();
  },
  EDIT: async function (req, res, id) {
    const comment = await getComment(id);
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.write(
      `<div>${comment.content}
        <form action="/comments/${comment.id}/patch" method="POST">
          <input type='text' name='content' value='${comment.content}' />
          <input type='submit'>update</input>
        </form>
        <a href='/comments'>go back</a>
      </div>`
    );
    res.end();
  },
  PATCH: async function (req, res, id) {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk.toString();
    });
    req.on("end", async () => {
      const [key, value] = data.split("=");
      console.log(key, value);
      // Your code here
      // const comment = await updateComment(id, content);
    });
    res.statusCode = 200;
    res.writeHead(302, { Location: "/comments" });
    res.end();
  },
};
