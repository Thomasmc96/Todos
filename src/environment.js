// Hostname
var hostname = "";
if (window.location.hostname === "localhost") {
  hostname =
    window.location.protocol + "//" + window.location.hostname + ":8000";
} else {
  hostname = window.location.protocol + "//" + window.location.hostname;
}

// Version
var version = "1.1.2";

export default [hostname, version];
