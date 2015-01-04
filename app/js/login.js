
var profilePage = '/profile/';

function login() {
  var user_l = document.getElementById('login_email').value;
  var user_p = document.getElementById('login_pass').value;
  
  userAppLogin(user_l, user_p);

  return false;
}

function userAppLogin(user_l, user_p) {
  UserApp.User.login({
    login: user_l,
    password: user_p,
  }, function(error, result) {
    if (error) {
      $('#login_error').text(error.message).show();
      console.log('login error: user.login:', error);
    } else {
      // The user is logged in. Now get the user...
      UserApp.User.get({ user_id: "self" }, function(error, user) {
        if (error) {
          $('#login_error').text(error.message).show();
          console.log('login error: user.get:', error);
        } else {
          onLoginSuccessful();
        }
      });
    }
  });

  return false;
}

// When the user has been logged in successfully
function onLoginSuccessful() {
  // Now, save the token in a cookie
  Cookies.set("ua_session_token", UserApp.global.token);

  console.log('onLoginSuccessful', 'token', UserApp.global.token);

  // Redirect the user to the index page
  window.location.href = profilePage;
}

function apply() {
  // This will sign up the user
  var user_l = document.getElementById('email').value;
  var user_p = document.getElementById('pass').value;
  
  UserApp.User.save({
    email: user_l,
    login: user_l,
    password: user_p
  }, function(error, user) {
    if (error) {
      $('#apply_error').text(error.message).show();
      console.log('apply error: user.save:', error);
    } else {
      console.log('apply success: user.save:', user);
      userAppLogin(user_l, user_p);
    }
  });

  return false;
}

