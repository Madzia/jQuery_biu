$(function() {
  "use strict";

  var fieldCallback = function ( err ) {
    if(err){
      // console.log(err);
      if(err.empty) return;
      $(this).parent().addClass("has-error");      
    }
    else{
      $(this).parent().removeClass("has-error");
      $(this).parent().addClass("has-success");      
    }
  }

  $("#textInput").valid("text", 
    { 
    "size": 
      { 
        "min": 2, 
        "max": 10 
      }, 
    "regexp": 
      {
        "pat": "^[A-Z]\\w+"
      },
    "condition": function () {
        return $(this).val() !== "Abc";
      }
    },
    fieldCallback, {"bind": "change keyup"});

  $("#postcodeInput").valid("postcode", 
    {     
      "size":
        {
        "min": 6,
        "max": 6
        },
      "condition": function () {
          return $(this).val() !== "99-999";
        }
    }, fieldCallback, {"bind": "change keyup"});
});
