
$(document).ready(function(){
  // once we click the submit button
  $("#submit").click(function() {
    //grab user's input
    var userProfile = {
      "name": $('#user-name').val().trim(),
      "age": $('#user-age').val().trim(),
      "occupation":$('#user-occu').val().trim(),
      "photoLink": $('#user-image').val().trim(),
      "vegetarian": $('#veg').val(),
      "differentDiet":$('#diet').val(),
      "favFood":$('#fav-food').val().trim(),
      "leastFood":$('#least-food').val().trim(),
      "favDrink":$('#fav-drink').val().trim(),
      "leastDrink":$('#least-drink').val().trim(),
      "introExtro": $('input:radio[name=in-ex]:checked').attr('id'),
      "freeTime":$('#free-time').val().trim(),
      "payView":$('input:radio[name=pay]:checked').attr('id'),
      "cookView":$('input:radio[name=cook]:checked').attr('id'),
      "minAvail":$('min-avail').val(),
      "location":[
        "lat":"",
        "long":"",
      ],
      "locationName":"",
    };
   
    //execute the function
      $.ajax( {
          data: userProfile
          url: "/api/newuser,
          method: "POST"
        }).done(function(res){
            console.log('User profile posted to database');
        });
   



  


