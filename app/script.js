
var indexPage = 'index.html';

var currentUser = null; // This will contain the logged in user

// Check if there is a session cookie
var token = Cookies.get("ua_session_token");
if (token) {
  // Yes, there is
  UserApp.setToken(token);

  // Get the logged in user
  getCurrentUser(function(user) {
    if (user) {
      currentUser = user;
      onUserLoaded();
    } else {
      window.location.href = indexPage;
    }
  });
} else {
  // No, redirect the user to the index page
  window.location.href = indexPage;
}

// Get the logged in user
function getCurrentUser(callback) {
  UserApp.User.get({ user_id: "self" }, function(error, user) {
    if (error) {
      callback && callback(null);
    } else {
      callback && callback(user[0]);
    }
  });
}

// Logout function
function logout() {
  Cookies.expire("ua_session_token");
  UserApp.User.logout(function() {
    window.location.href = indexPage;
  });
}


var profile = document.getElementById('profile');

function onUserLoaded() {
  console.log('currentUser', currentUser);

  var first_name = document.getElementById('first_name');
  first_name.value = currentUser.first_name;

  var last_name = document.getElementById('last_name');
  last_name.value = currentUser.last_name;

  var email = document.getElementById('email');
  email.value = currentUser.email;

  var props = currentUser.properties;
  for (var name in props) {
    var prop = props[name];
    var input = document.getElementById(name);
    if (input) {
      console.log('name', name, 'input', input, 'prop', prop);
      if (prop.value) {
        input.value = prop.value;
      }
      input.addEventListener('change', saveProfile);
    }
  }
}

function saveProfile(e) {
  console.log('saveProfile', e, this, this.id, this.value);

  // get the input that was updated
  var input = e.target || e.srcElement;

  var user = {
    'user_id': 'self',
    'properties': {}
  };

  user.properties[input.id] = {
    'value': input.value,
    'override': true
  };

  console.log('call save', user);

  UserApp.User.save(user, function(error, result) {
    console.log('saved', error, result);
  });
}
