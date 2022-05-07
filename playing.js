const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};
// const show = function(x) {
// let keys = Object.keys(urlDatabase);
// if (keys.includes(x)) {
//     console.log("found it!", x)
//  } else {
//     console.log("nope")
//   }
// }
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user353ndomID": {
    id: "user2RandomID",
    email: "uss33@examle.com",
    password: "abc"
  }
};
function checkUser(att, db) {
  let user = {};
  for (let u in db) {
    //console.log(db[u].email)
    if (db[u].email){
    user.email = (db[u].email);
    user.password = (db[u].password);
    return user;
    }
    
  }
  }


 console.log(checkUser("user2@example.com", users))


// const urlsForUser = function(id) {
//   let yourURLs = {};
//   for(let shortURL in urlDatabase) {
//     if((urlDatabase[shortURL].userID).includes(id)) {
//       yourURLs[shortURL] = urlDatabase[shortURL].longURL;
//       return yourURLs;
//     }
//   }
//   return false;
// }
// console.log(urlsForUser("aJ48lW"))
// userId = "user2RandomID"
// const validUser = () => {

//   if (!users[userId]) {
//     return false
//   } else {
//     return true
//   }
// }
// if (!validUser) {
//   console.log(nope)
// }

// console.log(validUser())
/* <tbody>
        <% if (loggedIn === false) { %>
          <h6>Log in to see your saved URLs</h6>
          <% } else { %>
        <% for(let shortURL in urls) { %>
          <% if( user_id === urls[shortURL].userID) { %>
            <tr>
              <td><%= shortURL %></td>
              <td><%= urls[shortURL].longURL %></td>

// const urls = urlDatabase;
// for(let u in urls) { *///}
//   console.log([u]);
//   console.log(urls[u].longURL)
// }
//console.log(urlDatabase[shortURL])
// const getData = function(user, database) {
//   if (database[user]) {
//     longURL = database[user].longURL;
//     shortURL = [user]
//     userID = database[user].userID;
//     return { longURL, shortURL, userID }
//   }
// }
// console.log(urlDatabase[shortURL]);
// console.log(show('isBoGr'))