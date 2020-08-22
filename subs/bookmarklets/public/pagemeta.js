(function () {
  if (!navigator.clipboard) {
    alert("clipboard not found!");
    return;
  }

  const today = new Date().toISOString().replace(/T.*/, "");
  const url = location.toString();
  const title = document.querySelector("title").innerText;

  const blob = `
${today}
  ${url}
    ${title}
`.trim();

  const banner = document.createElement("div");
  banner.style = `
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 20px;
  width: 100%;
  background: #bbb;
  border-top: 1px solid #777;
  font-family: monospace;
  font-size: 16px;
  z-index: 9999;
`;
  banner.innerText = blob;
  banner.onclick = () => {
    navigator.clipboard
      .writeText(blob)
      .then(() => banner.remove())
      .catch(() => alert("clipboard copy failed"));
  };
  document.body.appendChild(banner);
})();
