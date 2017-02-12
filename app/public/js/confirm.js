$(document).ready(function(){

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

    function locate() {
        navigator.geolocation.getCurrentPosition(initialize, fail);
    };

    function initialize(position) {
        var myLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        //console.log(position.coords.latitude);
        var mapOptions = {
            zoom: 17,
            center: myLatLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        console.log(myLatLng.lng(), myLatLng.lat());
        userProfile.location.lat = myLatLng.lat();
        userProfile.location.long = myLatLng.lng();
    }

    locate().then(function(){
      $.ajax( {
          data: userProfile.location,
          url: "/confirm",
          method: "GET"
        }).done(function(res){
            userProfile.locationName = res,
      //WHATEVER UYENS PROCESS IS FOR DISPLAYING THIS ON THE SCREEN;
        });
    }).then(function(){
      $.post({
        "/api/newuser",
        ,
        window.location.replace('/findpeople'),
      });
    };
  });
});
