var dataOne  = {
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