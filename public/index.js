var frontModule = (function() {

  /* id_token oAuth Google */
  var id_token = "";

  /* au clic sur Envoyer */
  function envoyerJoueur() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("demo").innerHTML = this.responseText;
      }
    };
    xhttp.open("POST", "/submit-form", true);
    xhttp.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
    xhttp.send(
      "username=" + document.getElementById("userNameInput").value + "&id_token=" + id_token
    );
  }

  /* gestion sécurité authent Google */
  function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile()
    id_token = googleUser.getAuthResponse().id_token
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("signed-in-mail").innerHTML = "Signed in as: " + profile.getEmail()
      }
    }
    xhttp.open("POST", "/tokensignin", true);
    xhttp.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    )
    xhttp.send("idtoken=" + id_token)
  }

  /* gestion sécurité authent Google */
  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
      console.log("User signed out.");
    });
  }

  return {
    envoyerJoueur: envoyerJoueur,
    onSignIn: onSignIn,
    signOut: signOut
  }
})();

window.onSignIn = frontModule.onSignIn