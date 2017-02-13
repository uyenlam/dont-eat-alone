// on click class .btnLogin ==> direct to the confirm.handlebars page
// this class .btnLogin is assigned to the 'Sign Up' and 'Sign In' buttons
// in the two "Sign Up" and "Sign In" modals

// Modal functions
$(document).ready(function(){
  // When the user clicks the Sign up red button on the welcome page
  // open the sign up modal
  $('#modal3').modal();
  // When the user clicks the Sign in red button on the welcome page
  // open the sign in modal
  $('#modal4').modal();

  // When the user clicks submit in the sign-up modal
  $('#sign-up-btn').click(function(){
    // grab user's input
    var userSignup = {
      "username":$('#username-signup').val().trim(),
      "password":$('#password-signup').val(),
      "photoLink":$('#photoLink-signup').val().trim(),
    }
    // post it to our signup API
    $.ajax( {
        data: userSignup,
        url: "/api/signup",
        method: "GET"
      }).done(function(res){
        // according to codes in controller.js, the user will be directed to
        // /confirm page
          console.log("User sign up information posted to server");
      });
  });

  // When the user clicks submit in the sign-in modal
  $('#sign-in-btn').click(function(){
    // grab user's input
    var userSignin = {
      "username":$('#username-signin').val().trim(),
      "password":$('#password-signin').val(),
    }
    // post it to our signin API
    $.ajax( {
        url: "/api/signin",
        method: "GET"
      }).done(function(res){
          // according to codes in controller.js, the user will be directed to
          // /confirm page
          console.log("User sign in request sent to server");
      });
  })
})
