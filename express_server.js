const express = require("express");
const app = express();
const PORT = 8080; //default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")

function generateRandomString() {
  const newString = Math.random().toString(36).slice(2, 7);
  return newString;
}

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
app.post("/urls", (res, req) => {
  console.log(req.body); //log the POST request to the console
  res.send("ok");
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


app.get("/urls/new", (req,res) => {
  res.render("urls_new");
})

app.get("/urls/:shortURL", (req, res) => {
//let key = Object.keys(templateVars).find(k=>obj[k]===value);
const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
// console.log(req.params)
res.render("urls_show", templateVars)
})




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});