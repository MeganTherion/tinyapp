//------------------REQUIREMENTS
const express = require("express");
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const { urlsForUser, checkUser } = require('./helpers.js')

function generateRandomString() {
  return Math.random().toString(36).slice(2, 8);
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
app.use(cookieSession({
  name: 'session',
  keys: ['myRandomSuperSecretKey', 'anotherRandomString'],
  //cookie options:
  maxAge: 24 * 60 * 60 * 1000 //24 hours
}))


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
  templateVars = {
    user_id: req.session.user_id
  };
  res.render("urls_new", templateVars);
})

app.get("/urls", (req, res) => {

  const templateVars = {
    user_id: req.session.user_id,
    urls: urlDatabase
  };
  res.render("urls_index", templateVars)
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    user_id: req.session.user_id,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL
  };
  res.render("urls_show", templateVars)
})


//---------------------auth front-end routes
app.get("/register", (req, res) => {
  const templateVars = {
    user_id: req.session.user_id
  };
  res.render("register", templateVars)
})

app.get("/login", (req, res) => {
  const templateVars = {
    user_id: req.session.user_id,
  }
  res.render("login", templateVars);
})

//------------------URLS/CRUD API
//create urls
app.post("/urls", (req, res) => {
  const { longURL } = req.body;
  if (!longURL) {
    return res.status(400).send({ message: "gimme that longURL" })
  }

  let shortURL = generateRandomString();

  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: req.session.user_id
  };
  res.redirect(`/urls/${shortURL}`)
});

//read all
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//read one
app.get("/u/:shortURL", (req, res) => {
  const { shortURL } = req.params
  const urlObject = urlDatabase[shortURL]
  if (!urlObject) {
    return res.status(404).send({ message: 'URL not found' })
  }

  res.redirect(urlObject.longURL)
})

//update
app.post("/urls/:shortURL/update", (req, res) => {
  const { longURL } = req.body;
  if (!longURL) {
    return res.status(400).send({ message: "gimme that longURL" })
  }

  const { shortURL } = req.params;

  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: req.session.user_id
  };
  res.redirect(`/urls/${shortURL}`)
})

//delete
app.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params;
  const urlObject = urlDatabase[shortURL]
  if (!urlObject) {
    return res.status(404).send({ message: 'URL not found' })
  }

  delete urlDatabase[shortURL];
  res.redirect(`/urls`);
});

//----------------AUTHENTICATION/API ROUTES
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Please provide email and password");
  }

  for (let u in users) {
    if (users[u].email === email) {
      return res.status(400).send("email already in use")
    }
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const id = generateRandomString()
  //hash password
  users[id] = {
    id,
    email,
    password: hashedPassword
  };

  req.session.user_id = 'user_id';
  res.redirect("/urls")
})

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  //console.log("req bod", req.body);
  if (!email || !password) {
    return res.status(400).send("Please provide email and password");
  }

  // let user = {};
  // for (let u in users) {
  //   if (users[u].email){
  //   user.email = (users[u].email);
  //   user.password = (users[u].password);
  //   user.id = (users[u].id);
  //   //return user;
  //   }

  const user = checkUser(users, email, password);
  console.log("user", user)
  if (!user) {
    return res.status(400).send("invalid credentials");
  }

  const passwordsMatch = bcrypt.compareSync(password, user.password);
  if (passwordsMatch === false) {
    return res.status(400).send("invalid credentials");
  }

  req.session.user_id = 'user_id';
  res.redirect('/urls');
})

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
})



//---------------------- LISTENER
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});