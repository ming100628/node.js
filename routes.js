export default {
  GET: {
    "/comments": {
      "": (await import("./controllers/comments.js")).default.GET,
      edit: (await import("./controllers/comments.js")).default.EDIT,
      patch: (await import("./controllers/comments.js")).default.PATCH,
    },
    "/christmas": {
      "": (await import("./controllers/christmas.js")).default.GET,
    },
    "/easter": { "": (await import("./controllers/easter.js")).default.GET },
  },
  POST: {
    "/comments": {
      "": (await import("./controllers/comments.js")).default.POST,
      patch: (await import("./controllers/comments.js")).default.PATCH,
    },
  },
};
