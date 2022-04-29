const express = require("express");
const app = express();
const PORT = 8080; //default port 8080
app.set("view engine", "ejs")

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//register handler on root path "/"
app.get("/", (req, res) => { 
  res.send("Hello!");
});
//add additional endpoints:
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//add response with html to be rendered in browser:
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
});

// will a variable created in one request be available in another?
app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});
//now check to see if it's available:
app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`)
}); //not available!

app.get("/urls", (req, res) => { 
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars)
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});