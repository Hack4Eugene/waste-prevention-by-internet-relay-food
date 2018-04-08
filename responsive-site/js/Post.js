
function CreatePost(title, amount, description, pickupWindow, pickupAddress) {
// get the form data
        // there are many ways to get this data using jQuery (you can use the class or id also)
        var formData = {
            'title': title,
            'status': 'available',
            'eligibility': [ "business" ],
            'amount': amount,
            'readiness': "harvestable",
            'description': description,
            'pickupWindow': pickupWindow,
            'pickupAddress': pickupAddress,
            'creationDate': Date.now(),
            'user': '5ac8ae15982abe65368ca658'
        };

        // process the form
        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : 'food.dlfsystems.com:10100', // the url where we want to POST
            data        : formData, // our data object
            dataType    : 'json', // what type of data do we expect back from the server
            encode          : true,
            success: function(msg){
                alert( "Data Saved: " + msg );
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("some error");
            }});

          }

          function ViewDonation(donationId) {

                  $.ajax({
                      type        : 'GET', // define the type of HTTP verb we want to use (POST for our form)
                      url         : '/Donations/Get', // the url where we want to POST
                      data        : { id: donationId }, // our data object
                      dataType    : 'json', // what type of data do we expect back from the server
                      encode          : true
                  })
                      // using the done promise callback
                      .done(function(data) {

                        $("title").val(data.title);

                          // here we will handle errors and validation messages
                      });

                    }

                    function DeleteDonation(donationId) {

                        $.ajax({
                            type        : 'GET', // define the type of HTTP verb we want to use (POST for our form)
                            url         : '/Donations/Get', // the url where we want to POST
                            data        : { id: donationId }, // our data object
                            dataType    : 'json', // what type of data do we expect back from the server
                            encode          : true
                        })
                            // using the done promise callback
                            .done(function(data) {

                                // here we will handle errors and validation messages
                            });

                          }

                          function GetAllDonations() {

                            $.ajax({
                                type        : 'GET', // define the type of HTTP verb we want to use (POST for our form)
                                url         : '/Donations/Get', // the url where we want to POST
                                dataType    : 'json', // what type of data do we expect back from the server
                                encode          : true
                            })
                                // using the done promise callback
                                .done(function(data) {
          
                                var tableHtml = "";

                                var obj = jQuery.parseJSON(data);
                                $.each(obj, function(key,value) {
                                    
                                }); 
          
                                    // here we will handle errors and validation messages
                                });
          
                              }


                              var getUrlParameter = function getUrlParameter(sParam) {
                                var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                                    sURLVariables = sPageURL.split('&'),
                                    sParameterName,
                                    i;
                            
                                for (i = 0; i < sURLVariables.length; i++) {
                                    sParameterName = sURLVariables[i].split('=');
                            
                                    if (sParameterName[0] === sParam) {
                                        return sParameterName[1] === undefined ? true : sParameterName[1];
                                    }
                                }
                            };

                            