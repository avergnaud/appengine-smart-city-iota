const express = require("express")
const path = require("path")
const {OAuth2Client} = require('google-auth-library')
const iotautil = require("./iotautil")
require('dotenv').config()



var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({port: 40510})

var connexions = []

wss.on('connection', function (ws) {
  connexions.push(ws)
  ws.on('message', function (message) {
    console.log('received: %s', message)
  })

  /*
  if(ws.readyState === ws.OPEN){
   // Do your stuff...
  }
  setInterval(
    () => ws.send(`${new Date()}`),
    1000
  )
  */
})



authorized_google_id = process.env.authorized_google_id

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
    console.log(bundle);
    for(connexion of connexions) {
      if(connexion.readyState === connexion.OPEN){
        connexion.send("http://tangle.glumb.de/?hash=" + bundle[0].trunkTransaction)
      }
    }
    res.send("transaction en cours pour " + username + " ...");
  })
  .catch(error => {
    console.log(error)
    res.send("erreur")
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
  if(userid !== authorized_google_id) {
    throw new Error("userid non autorisé");
  }
}