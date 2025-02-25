export function getUrlParams() {
  var url = window.location.href;
  var queryString = url.split("?")[1];

  var params: Record<string, string> = {};
  if (queryString) {
    var pairs = queryString.split("&");

    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split("=");

      var key = decodeURIComponent(pair[0]);
      var value = decodeURIComponent(pair[1] || "");

      if (params[key]) {
      } else {
        params[key] = value;
      }
    }
  }

  return params;
}
