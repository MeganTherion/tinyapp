//------------------REQUIREMENTS
const express = require("express");
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const { urlsForUser, checkUser } = require('./helpers.js')

function generateRandomString() {
  return Math.random().toString(36).slice(2, 8);
}

// function myGreeting() {
//   return  res.status(400).send({ message: "gimme that longURL" });
//   //res.redirect("/login");
//   //console.log('im the message')
// }




const urlDatabase = {
  // b6UTxQ: {
  //   longURL: "https://www.tsn.ca",
  //   userID: "aJ48lW"
  // },
  // i3BoGr: {
  //   longURL: "https://www.google.ca",
  //   userID: "aJ48lW"
  // },
  // isdoGr: {
  //   longURL: "https://www.facebook.com",
  //   userID: "user2RandomID"
  // }
};

const users = {
  // "userRandomID": {
  //   userName: "rachel",
  //   id: "userRandomID",
  //   email: "user@example.com",
  //   password: "purple-monkey-dinosaur"


  // },
  // "user2RandomID": {
  //   userName: "paulyD",
  //   id: "user2RandomID",
  //   email: "user2@examle.com",
  //   password: "abc"
  // }
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
    userName: req.session.userName,
    user_id: req.session.user_id
  };
  res.render("urls_new", templateVars);
})

app.get("/urls", (req, res) => {
  if (!req.session.user_id) {
    // setTimeout(() => {
    //   res.redirect("/login");
    // }, 5000);
    res.status(400).send( "Must log in to see URLs" )
    
    //timeout func to redirect
    //res.redirect("/login")
  }
  const templateVars = {
    userName: req.session.userName,
    user_id: req.session.user_id,
    urls: urlDatabase
  };
  res.render("urls_index", templateVars)
});

app.get("/urls/:shortURL", (req, res) => {
  console.log(req.session, req.params);
  if (!req.session.user_id) {
    res.status(400).send("Must log in to edit URLs")
  }
  console.log(urlDatabase[req.params.shortURL])
  const templateVars = {
    user_id: req.session.user_id,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    userName: req.session.userName
  };
  res.render("urls_show", templateVars)
})


//---------------------auth front-end routes
app.get("/register", (req, res) => {
  const templateVars = {
    userName: req.session.userName,
    user_id: req.session.user_id
    
  };
  res.render("register", templateVars)
})

app.get("/login", (req, res) => {
  const templateVars = {
    user_id: req.session.user_id,
    userName: req.session.userName
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
    userID: req.session.user_id,
    userName: req.session.userName
  };
  res.redirect(`/urls/${shortURL}`)
});

//read all
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//read one
app.get("/u/:shortURL", (req, res) => {
  
  if (!req.session.user_id) {
    return res.status(400).send({ message: 'must log in to delete URLs'})
  }
  const { shortURL } = req.params
  const urlObject = urlDatabase[shortURL]
  if (!urlObject) {
    return res.status(404).send({ message: 'URL not found' })
  }

  res.redirect(urlObject.longURL)
})

//update
app.post("/urls/:shortURL/update", (req, res) => {
  if (!req.session) {
    return res.status(400).send({ message: 'must log in to delete URLs'})
  }
  const { longURL } = req.body;
  if (!longURL) {
    return res.status(400).send({ message: "gimme that longURL" })
  }

  const { shortURL } = req.params;

  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: req.session.user_id,
    userName: req.session.userName
  };
  res.redirect(`/urls/${shortURL}`)
})

//delete
app.post("/urls/:shortURL/delete", (req, res) => {
  if (!req.session) {
    return res.status(400).send({ message: 'must log in to delete URLs'})
  }
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
  const { userName, email, password } = req.body;
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
    userName,
    email,
    password: hashedPassword
  };
  console.log(users);
  req.session.userName = userName;
  req.session.user_id = id;
  
  res.redirect("/urls")
})

app.post("/login", (req, res) => {
  const { email, password, userName } = req.body;
  if (!email || !password) {
    return res.status(400).send("Please provide email and password");
  }
console.log(users);
  for (let u in users) {
    if (users[u].email !== email) {
      return res.status(400).send("user cannot be found");
    }
    user = users[u];
  }
 

  const passwordsMatch = bcrypt.compareSync(password, user.password);
  if (passwordsMatch === false) {
    return res.status(400).send("wrong password");
  }

  req.session.user_id = 'user_id';
  res.redirect('/urls');
})

app.post('/logout', (req, res) => {
  req.session = null;
  console.log(users);
  res.redirect('/urls');
})



//---------------------- LISTENER
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});