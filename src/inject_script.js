try {
  let ext__foreground = document.createElement("div");
  let ext__foreground__script = document.createElement("script");
  ext__foreground__script.src = "foreground.bundle.js";
  ext__foreground.id = "dap__ext__foreground";
  ext__foreground.appendChild(ext__foreground__script);
  document.querySelector("body").appendChild(ext__foreground);
} catch (err) {
  console.log(err);
  ext__foreground = document.createElement("div");
  ext__foreground__script = document.createElement("script");
  ext__foreground__script.src = "foreground.bundle.js";
  ext__foreground.id = "dap__ext__foreground";
  ext__foreground.appendChild(ext__foreground__script);
  document.querySelector("body").appendChild(ext__foreground);
}
