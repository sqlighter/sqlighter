// Running SQLite in the browser using NextJS / Why not?
// https://willschenk.com/articles/2021/running_sq_lite_in_the_browser_using_next_js/

console.log("Adding sql-wasm.js script tag")
const s = document.createElement("script")
s.setAttribute("src", "/sql-wasm.js")
document.body.appendChild(s)

window.loadSQL = async () => {
  console.log("loadSQL function called")

  return await window.initSqlJs({
    locateFile: (file) => `/${file}`,
  })
}
