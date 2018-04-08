window.addEventListener('load', function() {

  var url_string = window.location.href.replace("#", "?");
  var url = new URL(url_string);
  var auth = url.searchParams.get("id_token");

  var r = new XMLHttpRequest();
  r.open("POST", "http://localhost:10100/posts", true);
  r.setRequestHeader("Content-Type", "application/json");
  r.setRequestHeader('Authorization', auth);
  r.send("");
})
