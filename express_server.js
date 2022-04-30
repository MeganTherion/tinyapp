const express = require("express");
const app = express();
const PORT = 8080; //default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")

function generateRandomString() {
  const newString = Math.random().toString(36).slice(2, 8);
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


app.get("/urls", (req, res) => { 
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars)
});

app.post("/urls", (req, res) => {
  console.log("req body", req.body); //log the POST request to the console
  let shortURL = generateRandomString();
  let longURL = req.body["longURL"];
  urlDatabase[shortURL]= `http://${longURL}`;
  //console.log(urlDatabase)
  res.redirect(`/urls/${shortURL}`)
  //res.send("ok");
  
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase["shortURL"]
  res.redirect(longURL);
})


app.get("/urls/new", (req,res) => {
  res.render("urls_new");
  // generateRandomString();
})

app.get("/urls/:shortURL", (req, res) => {
const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase["shortURL"] };
//console.log(req.params);
res.render("urls_show", templateVars)
// let longURL = urlDatabase["shortURL"]
// res.redirect(longURL);
})





app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});