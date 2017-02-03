// on click class .btnLogin ==> direct to the confirm.handlebars page
// this class .btnLogin is assigned to the 'Sign Up' and 'Sign In' buttons
// in the two "Sign Up" and "Sign In" modals



// Modal functions
    $('#modal1').modal('open');
    $('#modal2').modal('open');
    $('.modal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        in_duration: 300, // Transition in duration
        out_duration: 200, // Transition out duration
        starting_top: '4%', // Starting top style attribute
        ending_top: '10%', // Ending top style attribute
        ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.

            console.log(modal, trigger);
        },
        complete: function() {} // Callback for Modal close
    });
