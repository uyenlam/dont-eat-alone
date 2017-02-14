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

     $('#modal1').modal();
     // when the user clicks on an online user profile to view more information
     $('.friend-choice').click(function(){
       chosenId = this.id;
       var query = "/api/" + chosenId;
       console.log(query);
       // grab user's info based on their id
       $.ajax( {
           url: query,
           method: "GET"
         }).done(function(res){
           console.log(res);

           // append the result into the clicked profile modal DOM
           $('#selectPhoto').append("<img class='block' src='"+res.photoLink+"'>");
           $('#selectName').append('Name: ' + res.name);
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

     $('#send-req-btn').click(function(){
       function sendReq(){
         var request = {
           userId: chosenId,
           message:$('#request-message').val(),
         }; //var request

         var reqQuery = "/api/" + request.userId + "/newrequest";
         $.ajax( {
             data: request,
             url: reqQuery,
             method: "POST"
           }).done(function(res){
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
});
