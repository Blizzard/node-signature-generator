const throng = require("throng");
const app = require("./index");

const port = process.env.PORT || 3000;

throng(id =>
  app.listen(port, () => console.log(`${id}: Listening on ${port}`))
);
