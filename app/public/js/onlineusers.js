// IN THIS FILE WE NEED TO
// *============================================================================
// 1. Do a GET call for users information from the database/ API, save that into a variable
// and name that variable, var user, so that handlebars can begin populate information
// from that variable onto the DOM (reference file locationdata.handlebars to understand
// the front-end construction).

// code book for intepreting the id values of the IntroExtro, payView, and cookView questions
// that we received from the server
var inexRes = {
  'proudInt':'Proud Introvert',
  'int': 'Introvert',
  'neuExin': 'Neutral',
  'ext': 'Extrovert',
  'proudExt': 'Proud Extrovert',
};

var payRes = {
  'paySA': 'Strongly Agree',
  'payA': 'Agree',
  'payN': 'Neutral',
  'payD': 'Disagree',
  'paySD': 'Strongly Disagree',
};

var cookRes = {
  'cookSA': 'Strongly Agree',
  'cookA': 'Agree',
  'cookN': 'Neutral',
  'cookD': 'Disagree',
  'cookSD': 'Strongly Disagree',
}

$(document).ready(function(){
      var chosenId = [];
      var potentialReqId = [];
      //========================================================================
      // Preview online users and send requests
      //========================================================================
      // open onlineusers individual profiles
     $('#modal5').modal();

     // when the user clicks on an online user profile to view more information
     $('.friend-choice').click(function(){
       chosenId = this.id;
       var query = "/api/user/" + chosenId;
       console.log(query);
       // grab user's info based on their id
       $.ajax( {
           url: query,
           method: "GET"
         }).done(function(res){
           console.log(res);

           // append the result into the clicked profile modal DOM
           $('#selectPhoto').append("<img class='block' src='"+res.photoLink+"'>");
           $('#selectName').append(res.name);
           $('#selectOccupation').append('Occupation: ' + res.occupation);
           $('#selectAge').append('Age: ' + res.age);
           if (res.vegetarian === true){
             $('#selectVege').append('Vegetarian: Yes');
           } else if (res.vegetarian === false){
             $('#selectVege').append('Vegetarian: No');
           };
           if (res.differentDiet === true){
             $('#selectDiet').append('Can eat with someone with a different diet: Yes');
           } else if (res.differentDiet === false){
             $('#selectDiet').append('Can eat with someone with a different diet: No');
           };
           $('#selectFavfood').append('Favorite food: ' + res.favFood);
           $('#selectLeastfood').append('Least favorite food: ' + res.leastFood);
           $('#selectFavdrink').append('Favorite food: ' + res.favDrink);
           $('#selectLeastdrink').append('Favorite food: ' + res.leastDrink);

           // evaluate the responses with the codebook at the top of this sheet
           var a = res.introExtro; // for example, "int"
           var b = inexRes[a]; // "Introvert"
           $('#selectInEx').append('Introvert or Extrovert: ' + b); // "Introvert or Extrovert: Introvert"

           $('#selectFree').append('In my free time I like to: ' + res.freeTime);

           var c = res.payView; // for example, "paySA"
           var d = payRes[c]; // "Strongly Agree"
           $('#selectPay').append('When dining with a woman, a man should pay: ' + d);
           // "When diding with a woman, a man should pay: Strongly Agree"

           var e = res.cookView;
           var f = cookRes[e];
           $('#selectCook').append('When together in a relationship, a woman should cook: ' + f);

           $('#selectMin').append('I can eat for ' + res.minAvail + 'minutes today.');
         });
     });

     // send request
     $('#send-req-btn').click(function(){
       function sendReq(){
         var request = {
           'userId': chosenId, //the id of the online user whose profile was clicked prior to this
           'message':$('#request-message').val(),
         }; //var request

         var reqQuery = "/api/" + request.userId + "/newrequest";
         // create a new entry in the request model
         $.ajax( {
             data: request,
             url: reqQuery,
             method: "POST"
           }).done(function(res){
            // send a socket event along with id information of the request RECIPIENT, NOT THE SENDER
             socket.emit('send message',request.userId);
             console.log('Request successfully sent');

          }); //done function
       }; //sendReq function

       sendReq();
       $.when(sendReq).done(function(){
        // empty the chosenId variable
         chosenId = [];
       }) //when sendReq done
     }); // send-req-btn on click

     $('#cancel-modal-btn').click(function(){
       // empty the chosenId variable
       chosenId = [];
     });

     //========================================================================
     // Receiving requests and respond to requests
     //========================================================================

     socket.on('new message', function(data){ //data is the id of the RECIPIENT, not the sender
       // check if the current User received a request
       function checkUser(){
         $.ajax({
             url: '/api/currentuser',
             method: "GET"
           }).done(function(res1){
             if (data === res1.id){ //i.e if the current user is the recipient of the request
               receivedRequest(); // which shows the request in the request management portal
             } else {
               return; // do nothing
             }
           });
        }
        function receivedRequest(){
          // look for the latest request that has been sent to the user
          var query = '/api/' + data + '/requeststo/one';
          $.ajax({
              url: reqQuery,
              method: "GET"
            }).done(function(res1){ //the latest request
              console.log(res1);
              // look for the profile of the sender
              var senderId = res1.user_id;
              var senderQuery = '/api/' + senderId;
              $.ajax({
                  url: senderQuery,
                  method: "GET"
                }).done(function(res2){
                  // populate the sender information and message into the request management portal
                  var frame = '<div class="email-item pure-g request-choice" id="'+ res2.id +'" href="#modal6"></div>'; //id of the request sender
                  var a = '<div class="pure-u"></div>';
                  var aContent = '<img width="64" height="64" class="email-avatar" src="'+ res2.photoLink + '">';
      		         var b = '<div class="pure-u-3-4"></div>';
                  var bContent = '<h5 class="email-name">'+ res2.name +'</h5><h4 class="email-subject">' + res2.occupation + '</h4><p class="email-desc">' + res1.text + '</p>'

                  var aFin = a.append(aContent);
                  var bFin = b.append(bContent);

                  var html = frame.append(aFin).append(bFin);

                  $('#request-card').prepend(html);
                });
            });
        };

        checkUser();

     });

     // open detailed requests
     $('#modal6').modal();
     // when the user clicks on a request card on the left, a modal appears
     // giving more information about the sender of the request
     $('#request-choice').click(function(){
       potentialReqId = this.id; //which is the id of the request, not the user_id of the sender
       // we save it to a global variable for use later
       var query = "/api/request/" + id;
       console.log(query);
       // grab sender's info based on the request id
       $.ajax( {
           url: query,
           method: "GET"
         }).done(function(res1){
           console.log(res1);
           //get sender's id
           var userId = res1.user_id;
           var query = "/api/user/" + userId;
           // grab sender's info based on their user_id
           $.ajax( {
               url: query,
               method: "GET"
             }).done(function(res){
               // append the result into the clicked profile modal DOM
               $('#requestPhoto').append("<img class='block' src='"+res.photoLink+"'>");
               $('#newRequest').append("You have a new request from");
               $('#requestName').append(res.name);
               $('#requestOccupation').append('Occupation: ' + res.occupation);
               $('#requestAge').append('Age: ' + res.age);
               if (res.vegetarian === true){
                 $('#requestVege').append('Vegetarian: Yes');
               } else if (res.vegetarian === false){
                 $('requestVege').append('Vegetarian: No');
               };
               if (res.differentDiet === true){
                 $('#requestDiet').append('Can eat with someone with a different diet: Yes');
               } else if (res.differentDiet === false){
                 $('#requestDiet').append('Can eat with someone with a different diet: No');
               };
               $('#requestFavfood').append('Favorite food: ' + res.favFood);
               $('#requestLeastfood').append('Least favorite food: ' + res.leastFood);
               $('#requestFavdrink').append('Favorite food: ' + res.favDrink);
               $('#requestLeastdrink').append('Favorite food: ' + res.leastDrink);

               // evaluate the responses with the codebook at the top of this sheet
               var a = res.introExtro; // for example, "int"
               var b = inexRes[a]; // "Introvert"
               $('#requestInEx').append('Introvert or Extrovert: ' + b); // "Introvert or Extrovert: Introvert"

               $('#requestFree').append('In my free time I like to: ' + res.freeTime);

               var c = res.payView; // for example, "paySA"
               var d = payRes[c]; // "Strongly Agree"
               $('#requestPay').append('When dining with a woman, a man should pay: ' + d);
               // "When diding with a woman, a man should pay: Strongly Agree"

               var e = res.cookView;
               var f = cookRes[e];
               $('#requestCook').append('When together in a relationship, a woman should cook: ' + f);

               $('#requestMin').append('I can eat for ' + res.minAvail + 'minutes today.');
             })


         });
     });

     // accept a clicked request
     $('#send-req-btn').click(function(){
       function a(){
         var query = "/api/respond/"+ potentialReqId +"/accept"
         $.ajax( {
             url: query,
             method: "PUT"
           }).done(function(res1){
             console.log(res1);
             alert('Successfully accepted a request');
             window.location.href = "/onlineusers";
           });
       };

       a();
       $.when(a).done(function(){
         // empty the global variable
         potentialReqId = [];
       });
     });

     // decline a clicked request
     $('#cancel-req-btn').click(function(){
       function a(){
          var query = "/api/respond/"+ potentialReqId +"/decline";
          $.ajax( {
              url: query,
              method: "PUT"
            }).done(function(res1){
              console.log(res1);
              alert('Successfully declined a request');
              window.location.href = "/onlineusers";
            });
       };

       a();
       $.when(a).done(function(){
         //  empty the global variable
         potentialReqId = [];
       })
     });

     // close the request modal without doing anything
     // good for users who want to look at all the requests before making a decision
     $('#cancel-box-btn').click(function(){
       // empty the global variable
       potentialReqId = [];
     })
});
