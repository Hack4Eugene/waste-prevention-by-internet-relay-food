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
    
    localStorage.setItem("authBearer", "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlF6VkJSamhDUlRRNU5VVXdOekV5UkRrMk4wWTVSa05FTWpWRE5qQXhRekUwUlRGRFFrVXdNdyJ9.eyJuaWNrbmFtZSI6Im1pdGVtZWlzdGVyIiwibmFtZSI6Im1pdGVtZWlzdGVyQGdtYWlsLmNvbSIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci9hMTRkZDllMGUzODA0ZmNiOTczODc4MWJjMzE4MDJiOT9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRm1pLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDE4LTA0LTA4VDAwOjMwOjAzLjI5NFoiLCJlbWFpbCI6Im1pdGVtZWlzdGVyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6Ly9pcmYuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDVhYzk0OTVhNDNjODdmMTE0OWVmOThkMyIsImF1ZCI6Im9NWElhcTlVdzJUa1JpRjVHUHZIMjEyMmM1SUZGNWcyIiwiaWF0IjoxNTIzMTQ3NDAzLCJleHAiOjE1MjMxODM0MDMsImF0X2hhc2giOiIwZlQwV1FpNlVTc1lEUzZnV25iMDdRIiwibm9uY2UiOiJla3pMS0gwRVZRfkVETV9SWC5hbTJLeDYzWl9vaUNiNSJ9.evQUzStADo7YJzXGFZtDzIaPjhtKHHvjqYvqxe6fBYYIoQ6ThAUDjPqyr3IIe50QzOJiQxiHAVCRjVCrgJpCH7xL7KBJL96r0aGqkH68wKRPT10n5mDwPagsSZ_7lty5SgCdor8fMtTPt03u5XhV5wXIPhlYbw2frSL4tYouFlVep_3-19PPzX3pLBTI_SaXQrVbnBYMPg5_AGIU9_CHKpOnkjojdwv6yx8VNnNJJLzenQccTL5U-FzvPf6yISYJBhLJDcr6Nn6L09NCctpJwlrRDH43UIHz91LrlSDR3fGTqBmvml5hI-VgKcT-AnK_4kAttb0y1-XGab63IrC5Aw");
}
        