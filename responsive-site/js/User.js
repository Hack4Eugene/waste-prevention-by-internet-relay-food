function LogoutUser() {
    localStorage.setItem("currentUser", null);
}

function LoginUser() {
    var webAuth = new auth0.WebAuth({
        domain: 'irf.auth0.com',
        clientID: 'oMXIaq9Uw2TkRiF5GPvH2122c5IFF5g2',
        responseType: 'token id_token',
        audience: 'https://irf.auth0.com/api/v2/',
        scope: 'openid email profile',
        redirectUri: "http://food.dlfsystems.com/TheMarket.html"
      });

      webAuth.authorize();
}

function LoadUserFromSession() {
    var user = localStorage.getItem("currentUser");
}

function AddUserToSession() {

    var url_string = window.location.href.replace("#", "?");
    var url = new URL(url_string);
    var auth = url.searchParams.get("id_token");
    auth = "bearer " + auth;

   /* var r = new XMLHttpRequest();
    r.open("POST", "http://localhost:10100/posts", true);
    r.setRequestHeader("Content-Type", "application/json");
    r.setRequestHeader('Authorization', auth);
    r.send("");*/
    
    localStorage.setItem("authBearer",auth);
}
        