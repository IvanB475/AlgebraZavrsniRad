function timeSince(x) {
  var days = 0;
  var hours = 0;
  var minutes = 0;
  var postedBefore = "Posted ";
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

  if (days > 0) {
    postedBefore = postedBefore + days + " days, ";
  }
  if (hours > 0) {
    postedBefore = postedBefore + hours + " hours, ";
  }
  if (minutes > 0) {
    postedBefore = postedBefore + minutes + " minutes ago";
  }
  if (days < 1 && hours < 1 && minutes < 1) {
    postedBefore = "Posted less than a minute ago";
  }
  return postedBefore;
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
