$("#logout-user").click(() => {
    LogoutUser();
  });

function LoadUser(){
    var user = localStorage.getItem("authBearer");
    if(user == "null") {
        $("#logout-menu").hide();
        $("#login-menu").show();
        $("#signup-menu").show();
    } else {
        $("#logout-menu").show();
        $("#login-menu").hide();
        $("#signup-menu").hide();
    }
}

function LogoutUser() {
    localStorage.setItem("authBearer", null);
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
    
    localStorage.setItem("authBearer", "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlF6VkJSamhDUlRRNU5VVXdOekV5UkRrMk4wWTVSa05FTWpWRE5qQXhRekUwUlRGRFFrVXdNdyJ9.eyJuaWNrbmFtZSI6Im1pdGVtZWlzdGVyIiwibmFtZSI6Im1pdGVtZWlzdGVyQGdtYWlsLmNvbSIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci9hMTRkZDllMGUzODA0ZmNiOTczODc4MWJjMzE4MDJiOT9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRm1pLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDE4LTA0LTA4VDA0OjQ5OjAxLjA0NloiLCJlbWFpbCI6Im1pdGVtZWlzdGVyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6Ly9pcmYuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDVhYzk0OTVhNDNjODdmMTE0OWVmOThkMyIsImF1ZCI6Im9NWElhcTlVdzJUa1JpRjVHUHZIMjEyMmM1SUZGNWcyIiwiaWF0IjoxNTIzMTYyOTQxLCJleHAiOjE1MjMxOTg5NDEsImF0X2hhc2giOiJ5RXN6ZnpFOUhPZ3I4SU1FTWlSamRBIiwibm9uY2UiOiJjUFNsRURCQmsyNm9PU3BJWVJ2aGU5aWRMSnBldGkyZCJ9.jeiAyJYATl7hRUyuboCNvLnFL7Weiysahtb2HewCbHlS4LgyFQBehzBQqthtPO1TyhBbFarJHKKLfWX3DGBhF8Shnci64x0UEKllpK1nPIgRCdgdgH1Myv6f-sxElM76TGrALOfjy4jsqRZvTQbx4Lsy6U9Agc6xky-pse2gMKSxnjRrNZSE9beB9JEuquuKJ799pm1MS5WijrgJCExKpvIkyfLDNuTXJkrq7Xe7UwkkCq9wagQs-5VInRo1Gg932OGZvKCkkW7qMqAdldjjcBkbl3vJAO79fRNh9WRtdWGlTnpdw_vIPbBjTEPWEC1UGjKOUSwb5pWhmb8PHkd-Tw");
}
        