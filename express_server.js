const express = require("express");
const app = express();
const PORT = 8080; //default port 8080
const cookies = require('cookie-parser');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}), cookies());
app.set("view engine", "ejs")

function generateRandomString() {
  const newString = Math.random().toString(36).slice(2, 8);
  return newString;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@examle.com",
    password: "dishwasher-funk"
  }
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
  const templateVars = { user_id: req.cookies["user_id"], urls: urlDatabase };
  res.render("urls_index", templateVars)
});



app.post("/login", (req, res) => {
  const {userEmail, userPass} = req.body;
  const currentUser = users.find((user) => {return user.email === userEmail && user.password === userPass});
  console.log(currentUser)
  res.cookie('user_id', currentUser.id);
  res.redirect(`/urls`)
})

app.post("/logout", (req, res) => { 
  const user_id = req.cookies["user_id"]
  res.clearCookie('user_id', user_id);
  res.redirect('/urls');
})

app.post("/urls/:shortURL/update", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL]= `http://${longURL}`;
  res.redirect(`/urls`)
})

app.post("/urls", (req, res) => {
  //console.log("req body", req.body); //log the POST request to the console
  let shortURL = generateRandomString();
  //let username = req.cookies["username"]
  let longURL = req.body["longURL"];
  urlDatabase[shortURL]= `http://${longURL}`;
  //console.log(urlDatabase)
  res.redirect(`/urls/${shortURL}`)
  //res.send("ok");
  
});



app.post("/urls/:shortURL/delete", (req, res) => {
  //const username = req.cookies["username"]
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});



app.get("/u/:shortURL", (req, res) => {
  //const username = req.cookies["username"]
  const longURL = urlDatabase[req.params.shortURL]
  //console.log(longURL, shortURL);
  if (!longURL) {
    return res.status(401).send("URL does not exist"); 
  }
  res.redirect(longURL);
})

app.get("/register", (req, res) => {
  const templateVars = { user_id: req.cookies["user_id"] }
  res.render("register", templateVars)
})





app.post("/register", (req, res) => {
  const templateVars = { users }
  //const templateVars = { username: req.cookies["username"] };
  //console.log(req.body.userName["id"]);
  console.log("req body", req.body)
  const newUserId = generateRandomString();
  res.cookie('user_id', newUserId)
  users[newUserId] = {
    id : newUserId,
    name : req.body.userName,
    email : req.body.email,
    password : req.body.password
  };
  console.log(users)
  
  //if email = '' res.error
  
  // if (users[user_id].email === '') {
  //   return res.status(400).send("email field cannot be empty");
  //  } if (users[user_id].password === '') {
  //  return res.status(400).send("password field cannot be empty");
  // } for (let u in users) {
  //   if (u["email"] === users[user_id].email) {
  //   return res.status(400).send("email already in use")
   //}

  res.redirect("/urls")
  //res.render(templateVars);
})
// const userHelper = function(lookup) {
//   for (let u in users) {
//     if (u[lookup] === users[user_id][lookup]) {
//       return true
//     }
//   }
// }

app.get("/urls/new", (req,res) => {
  
  //console.log(templateVars );
  res.render("urls_new", templateVars);
  // generateRandomString();
})

app.get("/urls/:shortURL", (req, res) => {
const templateVars = { user_id: req.cookies["user_id"], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
res.render("urls_show", templateVars)
 res.redirect(longURL);
})





app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});