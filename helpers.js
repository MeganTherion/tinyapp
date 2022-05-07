function urlsForUser(id, database) {
  let yourURLs = {};
  for (let shortURL in database) {
    if ((database[shortURL].userID).includes(id)) {
      yourURLs[shortURL] = database[shortURL].longURL;
      return yourURLs;
    }
  }
  return false;
}

function checkUser(db, add, pass) {
  let user = {};
  for (let u in db) {
    //console.log(db[u].email)
    if (db[u][add]) {
      user.email = (db[u][add]);
      user.password = (db[u][pass]);
      user.id = (db[u].id);
      return user;
    }
  }
}


module.exports = { urlsForUser, checkUser }