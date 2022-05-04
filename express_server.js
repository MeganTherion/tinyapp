const express = require("express");
const app = express();
const PORT = 8080; //default port 8080
const cookies = require('cookie-parser');
const bodyParser = require("body-parser");
const { Template } = require("ejs");
app.use(bodyParser.urlencoded({extended: true}), cookies());
app.set("view engine", "ejs")
let loggedIn = false;
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
  const templateVars = { 
    user_id: req.cookies["user_id"], 
    urls: urlDatabase 
  };
  res.render("urls_index", templateVars)
});

app.get("/login", (req, res) => {
  const templateVars = { 
    user_id: req.cookies["user_id"], 
  }
  res.render("login", templateVars);
})

app.post("/login", (req, res) => {
  if (loggedIn === true) {
    res.render('/urls');
  }
  const templateVars = { users }
  for (let u in users) {  
    if (!req.body.email) {
    return res.status(403).send("email not found");
   } else if (req.body.email === users[u].email) {
     if (users[u].password !== req.body.password) {
       return res.status(403).send("wrong password");
     }
     const user_id = users[u].id;
     res.cookie('user_id', user_id);
     res.redirect('/urls');
     loggedIn = true;
   }
  }
  
  //console.log(user_id, password)

})

app.post('/logout', (req, res) => { 
  const user_id = req.cookies["user_id"]
  loggedIn = false;
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
  if (loggedIn === false) {
    res.send("Only logged in users may post here")
  }
  let shortURL = generateRandomString();
  let longURL = req.body["longURL"];
  urlDatabase[shortURL]= `http://${longURL}`;
  res.redirect(`/urls/${shortURL}`)
  
  
});



app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});



app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
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
  console.log("req body", req.body)
  const newUserId = generateRandomString();
  const newUser = {
    id : newUserId,
    name : req.body.userName,
    email : req.body.email,
    password : req.body.password
  };
  if (newUser.email === '') {
    return res.status(400).send("email field cannot be empty");
   } if (newUser.password === '') {
   return res.status(400).send("password field cannot be empty");
  } 
  for (let u in users) {  
    if (users[u].email === newUser.email) {
    return res.status(400).send("email already in use")
   }
  }
  users[newUserId] = newUser;
  res.cookie('user_id', newUserId)
  res.redirect("/urls")
  //console.log(newUserId)
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
  if (loggedIn === false) {
    console.log('not logged in')
    return res.redirect("/login")
  } 
  templateVars = { 
    user_id: req.cookies["user_id"], 
    urls: urlDatabase 
  };
    res.render("urls_new", templateVars);
  
// generateRandomString();
})

app.get("/urls/:shortURL", (req, res) => {
const templateVars = { user_id: req.cookies["user_id"], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
res.render("urls_show", templateVars)
 res.redirect("/longURL");
})





app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});