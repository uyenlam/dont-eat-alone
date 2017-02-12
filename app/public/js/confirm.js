/*var dataOne  = {
    "lat" : "",
    "long" : ""
};
$("submit").click(function() {

    function locate() {
        navigator.geolocation.getCurrentPosition(initialize, fail);
    }

    function initialize(position) {
        var myLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        //console.log(position.coords.latitude); 
        var mapOptions = {
            zoom: 17,
            center: myLatLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        console.log(myLatLng.lng(), myLatLng.lat());
        dataOne.lat = myLatLng.lat();
        dataOne.long = myLatLng.lng();
    }
locate(); 
});



$.ajax( { 
    data: dataOne,  
    url: "/confirm", 
    method: "GET"}).done(function(res){ 

//WHATEVER UYENS PROCESS IS FOR DISPLAYING THIS ON THE SCREEN; 

    }); 

*///commented out all the code above this to make way for a new confirm.js file (chad)  

<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <title>Google Maps User Location</title>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD-495IBdppX1la6lBN5KTa8-bQG8_6UCQsensor=false"></script>
    <style>
    html, body, #map_canvas{width:100%;height:100%;}
    </style>
  </head>
  <body>
    <ul id="restaurantList">
    </ul>




</body>
<script>
function xhrGet(route, cb) {
   var request = new XMLHttpRequest();
   request.open('GET', route, true);
   request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
         var resp = request.responseText;

         cb(JSON.parse(resp));
      } else {

      }
   };
   request.onerror = function() {
      console.log('things happened');
   };
   request.send();

};

</script>
<script>
    var im = 'http://www.robotwoods.com/dev/misc/bluecircle.png';
    var restaurantList = document.getElementById('restaurantList');
    function locate(){
        navigator.geolocation.getCurrentPosition(initialize,fail);
    }

    function initialize(position) {
        console.log('intialize func position',position);
        var myLatLng = {lat: position.coords.latitude, lng:position.coords.longitude };
        console.log('myLatLng', myLatLng);
        var nearbyRoute = '/nearby/'+ position.coords.latitude +'/' + position.coords.longitude;
        xhrGet(nearbyRoute, function(result) {
          console.log('result', result);
          if(result === 'error') return;
        console.log(result.nearby_restaurants[0])
        restaurantList.innerHTML =  result.nearby_restaurants.map(function(item, index){
              return '<li><strong>' + item.restaurant.name +'</strong></li>';
         }).join('')
        })
      }


     function fail(){
         alert('navigator.geolocation failed, may not be supported');
     }
     locate();
  </script>
</html>
