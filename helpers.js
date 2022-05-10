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

function checkUser(db, add) {
  let user = {
    userName,
    email,
    password,
    id
  };
  for (let u in db) {
    //console.log(db[u].email)
    if (db[u][add]) {
      user = [u];
      return user;
    }
  }
}





module.exports = { urlsForUser, checkUser }