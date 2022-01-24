function click(e: any) {
  chrome.tabs.create({ url: e.target?.href + "&extid=" + chrome.runtime.id });
  window.close();
}

document.addEventListener("DOMContentLoaded", () => {
  var anchors = document.querySelectorAll("a");
  for (var i = 0; i < anchors.length; i++) {
    anchors[i].addEventListener("click", click);
  }
});
