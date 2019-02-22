const express = require("express");
const path = require("path");
const app = express();

app.use(express.urlencoded());
app.use('/static', express.static(path.join(__dirname, 'public')))

app.post("/submit-form", (req, res) => {
  const username = req.body.username;
  //...
  console.log(username);
  res.send({ hello: 'world' });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});
