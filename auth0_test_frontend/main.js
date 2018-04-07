window.addEventListener('load', function() {

  var webAuth = new auth0.WebAuth({
    domain: 'irf.auth0.com',
    clientID: 'oMXIaq9Uw2TkRiF5GPvH2122c5IFF5g2',
    responseType: 'token id_token',
    audience: 'https://irf.auth0.com/api/v2/',
    scope: 'openid email profile',
    redirectUri: "http://localhost:8080/callback.html"
  });

  var loginBtn = document.getElementById('btn-login');

  loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    webAuth.authorize();
  });

});
