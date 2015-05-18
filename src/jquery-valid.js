(function( $ ){
  "use strict";

  var valid = {
    "text": function (that, options) {
      var value = $(that).val();
      var err = false;
      var errType = {};

      if(value.length === 0){
        errType.empty = true;
      }

      if(options.size){
        if(options.size.min){
          if(value.length < options.size.min){
            err = true;
            if(!errType.size){ errType.size = {}; }
            errType.size.min = true;
          }
        }
        if(options.size.max){
          if(value.length > options.size.max){
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
        if(!patt.test(value)){
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
      return { "valid": !err, "errType": errType };
    },
    "postcode": function (that, options) {
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
    'field': function ( method, options, callback, trigger ) {

      return this.each(function () {
        var doValid = function () { 
          var isValid = valid[ method ](this, options);
          if(isValid.valid){
            callback.call(this);
	    $("label:last").html("");
      	    $("#submitBtn").removeAttr("disabled");
		d3.text("file:///home/magda/biu/biu_jQuery/rozw/examples/fields/files/kody.csv", function(data) {
			var dane = data.split(/[\n\r]/).map(function(line) { return line.split(';')})
			for (var i=0; i<dane.length; i++)
				if (dane[i][0] == ($("#postcodeInput").val())) $( "label:last" ).html(dane[i][2]);
		});
          } 
          else {
            callback.call(this, isValid.errType);
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
    else {
      $.error('Method ' + method + ' does not exists in jQuery.valid');
    }
  };

})( jQuery );

