(function( $ ){
  "use strict";

  var valid = {
    "text": function (that, options) {
      var value = $(that).val();
      var err = false;
      var errType = {};
      // //console.log($(that).val());

      if(value.length === 0){
        errType.empty = true;
      }

      if(options.size){
        if(options.size.min){
          if(value.length < options.size.min){
            // //console.log("size.min err");
            err = true;
            if(!errType.size){ errType.size = {}; }
            errType.size.min = true;
          }
        }
        if(options.size.max){
          if(value.length > options.size.max){
            // //console.log("size.max err");
            err = true;
            if(!errType.size){ errType.size = {}; }
            errType.size.max = true;
          }
        }
      }
      if(options.regexp && options.regexp.pat){
        var patt;
        if(options.regexp.mod){
          patt = new RegExp(options.regexp.pat, options.regexp.mod);
        } else{
          patt = new RegExp(options.regexp.pat);
        }
        // //console.log(patt);
        // //console.log(patt.test(value));
        if(!patt.test(value)){
          // //console.log("regexp err");
          err = true;
          errType.regexp = true;
        }
      }
      if(options.condition){
        if(! options.condition.call(that, {}) ){
          err = true;
          errType.condition = true;
        }
      }
      //console.log(err);
      
      // console.log(errType);

      return { "valid": !err, "errType": errType };
    },
    "postcode": function (that, options) {
      // console.log(options);
      var settings = $.extend(
        {
          "size": 
          { 
            "min": 6, 
            "max": 6 
          }, 
        "regexp": 
          {
	    "pat": "[0-9]{2}-[0-9]{3}"
          }
        }, 
        options);
      console.log(settings);

      return valid.text(that, settings);
    },
    "fields": function (that) {
      var err = false;
      //console.log(that);

      $(that.field).each(function () { 
        var isValid = valid[ that.type ](this, that.options);

        if(!isValid.valid){
          that.callback.call(this, isValid.errType);
          err = true;
        }
        else {
          that.callback.call(this);
        }

      });

      return !err;
    }
  }

  var methods = {
    'init': function ( options ) {
      console.log("Usage: $(selector).valid(type, options)");
      console.log("Go to http://github.com/mmotel/jquery-plugin-validation/ for more details.");

      return this;
    },
    'field': function ( method, options, callback, trigger ) {
      //console.log(options);

      return this.each(function () {
        var doValid = function () { 
          var isValid = valid[ method ](this, options);

          if(isValid.valid){
            callback.call(this);
	    $("label:last").html("dsa")
      	    $("#submitBtn").removeAttr("disabled");
	    $( "#label:last" ).load( "/files/kody.csv", { limit: 25 }, function() {
		  alert( "The last 25 entries in the feed have been loaded" );
	    });
          } 
          else {
            callback.call(this, isValid.errType);
	    $("label:last").html("")
      	    $("#submitBtn").attr("disabled", "disabled");
          }
       }

       if(trigger && trigger.bind){
        $(this).bind(trigger.bind, function () {
          doValid.call(this);
        });
       }

       doValid.call(this);

      });
    }
  };
  
  $.fn.valid = function ( method ) {
    if( valid[ method ] && method !== "fields" ) {
      return methods.field.apply( this, arguments );
    }
    else if( methods[ method ] && method !== "field" ){
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
    }
    else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    }
    else {
      $.error('Method ' + method + ' does not exists in jQuery.valid');
    }
  };

})( jQuery );
