//------------------REQUIREMENTS
const express = require("express");
const cookies = require('cookie-parser');
const bodyParser = require("body-parser");

function generateRandomString() {
  return Math.random().toString(36).slice(2, 8);
}

function urlsForUser(id) {
  let yourURLs = {};
  for (let shortURL in urlDatabase) {
    if ((urlDatabase[shortURL].userID).includes(id)) {
      yourURLs[shortURL] = urlDatabase[shortURL].longURL;
      return yourURLs;
    }
  }
  return false;
}

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  },
  isdoGr: {
    longURL: "https://www.facebook.com",
    userID: "user2RandomID"
  }
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
    password: "abc"
  }
};

//------------------SETUP/MIDDLEWARES
const app = express();
const PORT = 8080; //default port 8080
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: false }));


//-----------------ROUTES/ENDPOINTS

//register handler on root path "/"
app.get("/", (req, res) => {
  res.send("Hello!");
});

//add response with html to be rendered in browser:
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
});

//--------------------URLs front-end routes
app.get("/urls/new", (req, res) => {
  if (loggedIn === false) {
    return res.redirect("/login")
  }
  templateVars = {
    user_id: req.cookies["user_id"],
    urls: urlDatabase
  };
  res.render("urls_new", templateVars);
})

app.get("/urls", (req, res) => {
  if (loggedIn === false) {

  }
  const templateVars = {
    loggedIn: loggedIn,
    user_id: req.cookies["user_id"],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars)
});

app.get("/urls/:shortURL", (req, res) => {
  if (urlsForUser(req.cookies["user_id"]) === false) {
    res.status(400).send("gotta log in")
  }
  const templateVars = {
    user_id: req.cookies["user_id"],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL
  };

  //console.log(req.params)
  res.render("urls_show", templateVars)
  res.redirect("/longURL");

})


//---------------------auth front-end routes
app.get("/register", (req, res) => {
  const templateVars = { user_id: req.cookies["user_id"] }
  res.render("register", templateVars)
})

app.get("/login", (req, res) => {
  console.log(users)
  const templateVars = {
    user_id: req.cookies["user_id"],
  }
  res.render("login", templateVars);
})

//------------------URLS/CRUD API
//create urls
app.post("/urls", (req, res) => {
  if (loggedIn === false) {
    res.send("Only logged in users may post here")
  }
  let shortURL = generateRandomString();
  let longURL = req.body["longURL"];
  let userID = req.cookies["user_id"];
  urlDatabase[shortURL] = {
    longURL: `http://${longURL}`,
    userID: userID
  };
  res.redirect(`/urls/${shortURL}`)
  console.log(urlDatabase)
});

//read all
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//read one
app.get("/u/:shortURL", (req, res) => {
  let keys = Object.keys(urlDatabase);
  if (keys.includes(req.params.shortURL)) {
    res.redirect(urlDatabase[req.params.shortURL].longURL);
  } else {
    return res.status(401).send("URL does not exist");
  }

})

//update
app.post("/urls/:shortURL/update", (req, res) => {
  if (urlsForUser(req.cookies["user_id"]) === false) {
    res.status(400).send("gotta log in")
  }
  const user_id = req.cookies["user_id"];
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  console.log(req.params)
  urlDatabase[shortURL] = {
    longURL: `http://${longURL}`,
    userID: user_id
  };
  res.redirect(`/urls`)
})

//delete
app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlsForUser(req.cookies["user_id"]) === false) {
    res.status(400).send("gotta log in")
  }
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

//----------------AUTHENTICATION/API ROUTES
app.post("/register", (req, res) => {
  const templateVars = { users }
  //console.log("req body", req.body)
  const newUserId = generateRandomString();
  const newUser = {
    id: newUserId,
    name: req.body.userName,
    email: req.body.email,
    password: req.body.password
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
})

app.post('/logout', (req, res) => {
  const user_id = req.cookies["user_id"]
  loggedIn = false;
  res.clearCookie('user_id', user_id);
  res.redirect('/urls');
})



//---------------------- LISTENER
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});