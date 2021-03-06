const express = require("express")
const path = require("path")
const {OAuth2Client} = require('google-auth-library')
const iotautil = require("./iotautil")
require('dotenv').config()

authorized_google_ids = process.env.authorized_google_ids
const authorized_google_ids_array = authorized_google_ids.split(" ")

const app = express()
const googleClientId = "955369598263-41nek13o5fk17ituf5dn7psib3sesmpn.apps.googleusercontent.com"
const client = new OAuth2Client(googleClientId)

app.use(express.urlencoded());
app.use(express.static('public'))

app.post("/tokensignin", (req, res) => {
  verify(req.body.idtoken)
  .then(success => {
    res.send("ok");
  })
  .catch(error => {
    res.status(403).send("erreur")
  });
});

app.post("/submit-form", (req, res) => {
  const username = req.body.username;
  const id_token = req.body.id_token;
  verify(id_token)
  .then(success => {
    return iotautil.send(username)
  })
  .then(bundle => {
    console.log(bundle[0].hash);
    res.send("transaction envoyée pour " + username);
  })
  .catch(error => {
    console.log(error)
    res.send(error)
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Example app listening at http://${host}:${port}`);
});

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: googleClientId
  });
  const payload = ticket.getPayload();
  var userid = payload['sub'];
  if(!authorized_google_ids_array.includes(userid)) {
    throw new Error("userid non autorisé");
  }
}