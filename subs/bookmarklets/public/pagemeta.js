/* eslint-disable no-alert */
(() => {
  const now = new Date();
  const today = new Date(now - now.getTimezoneOffset() * 60 * 1000).toISOString().replace(/T.*/, "");
  const title = (document.querySelector("title") || {innerText: ""}).innerText.trim().replace(/\s+/g, " ");
  const url = document.location.toString();
  const buttonText = navigator.clipboard ? "copy and close" : "close";
  const copyText = `${today}\n  ${title}\n    ${url}`;

  const banner = document.createElement("div");
  banner.className = "pagemeta";
  banner.innerHTML = `
<style>
.pagemeta {
  all: revert;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgb(0, 0, 0, 0.7);
  z-index: 9999;
}
.pagemeta div {
  all: revert;
  padding: 20px;
  color: white;
  font-family: monospace;
  font-size: 16px;
  text-align: left;
  white-space: pre;
}
.pagemeta button {
  all: revert;
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
<div>${copyText}</div>
<button>${buttonText}</button>
  `.trim();
  document.body.appendChild(banner);

  document.querySelector(".pagemeta button").onclick = () => {
    if (!navigator.clipboard) {
      banner.remove();
      return;
    }
    navigator.clipboard
      .writeText(copyText)
      .then(() => banner.remove())
      .catch(() => alert("clipboard copy failed"));
  };
})();
