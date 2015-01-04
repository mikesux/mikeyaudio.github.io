
var indexPage = '/login';

var currentUser = null; // This will contain the logged in user

function gotoIndex() {
  window.location.href = indexPage;
}

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
      gotoIndex();
    }
  });
} else {
  // No, redirect the user to the index page
  gotoIndex();
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
    gotoIndex();
  });
  return false;
}

var profile = document.getElementById('profile');

function onUserLoaded() {
  console.log('currentUser', currentUser);

  var first_name = document.getElementById('first_name');
  first_name.value = currentUser.first_name;
  first_name.addEventListener('change', saveProfile);

  var last_name = document.getElementById('last_name');
  last_name.value = currentUser.last_name;
  last_name.addEventListener('change', saveProfile);

  var email = document.getElementById('email');
  email.value = currentUser.email;
  email.addEventListener('change', saveProfile);

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
  };

  if (input.id == 'first_name' ||
      input.id == 'last_name' ||
      input.id == 'email') {
    user[input.id] = input.value;
  } else {
    user.properties = {};
    user.properties[input.id] = {
      'value': input.value,
      'override': true
    };
  }

  console.log('call save', user);

  UserApp.User.save(user, function(error, result) {
    if (error) {
      $('#' + input.id + '_error').text(error.message).show();
      console.log('error: user.save:', error);
    } else {
      $('#' + input.id + '_error').hide();
      console.log('saved', result);
    }
  });
}

function submitProfile() {
  $('#profile_success').show();
  return false;
}

