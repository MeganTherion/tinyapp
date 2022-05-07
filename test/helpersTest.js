const { assert } = require('chai');

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
    const expectedUserID = "userRandomID";
   assert(user = expectedUserID, 'user = expectedUserID')
  });
});