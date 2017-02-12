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


   // grab user's location information (longitude and latitude)
    function locate(){
       navigator.geolocation.getCurrentPosition(initialize,fail);
     }

   // if grabbing location is a success, do thi
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

   // if failed, do this
   function fail(){
        alert('navigator.geolocation failed, may not be supported');
    }

   //execute the function
    locate();
