// const { assert } = require('chai');

const { checkUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('checkUser', function() {
  it('should return a user with valid email & password', function() {
    const user = checkUser(testUsers, email, password)
    
    const expectedUser = "user@example.com";
    
   assert(user = expectedUser, 'user = expectedUserID')
   console.log(checkUser(testUsers, 'email', 'password'))
   console.log(expectedUser = "user@example.com");
  });
});