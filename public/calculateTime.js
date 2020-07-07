function timeSince(x) {
  var days = 0;
  var hours = 0;
  var minutes = 0;
  var time;
  if (x > 86400000) {
    days = Math.floor(x / 86400000);
    x = x % 86400000;
  }
  if (x > 3600000) {
    hours = Math.floor(x / 3600000);
    x = x % 3600000;
  }
  if (x > 60000) {
    minutes = Math.floor(x / 60000);
  }

  if (days > 0 || hours > 0 || minutes > 0) {
    time =
      "Posted " +
      days +
      " days, " +
      hours +
      " hours," +
      minutes +
      " minutes ago";
  } else {
    time = "Posted less than a minute ago";
  }
  return time;
}

document.addEventListener("DOMContentLoaded", function (event) {
  var x = document.getElementsByClassName("timeSince");
  console.log(x.length);
  for (var i = 0; i < x.length; i++) {
    console.log(x[i]);
    console.log("Hey");
    console.log(timeSince(x[i].innerText));
    x[i].innerText = timeSince(x[i].innerText);
  }
});
