
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

        var authBearer = localStorage.getItem("authBearer"); 

        // process the form
        $.ajax({
            type        : 'POST',
            url         : 'http://food.dlfsystems.com:10100/posts',
            data        : formData,
            contentType: "application/json; charset=utf-8",
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", authBearer);
            },
            success: function(msg){
                alert( "Data Saved: " + msg );
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest.response)
                console.log(textStatus);
                console.log(errorThrown);
            }});

}
var allposts;
function GetAllPosts() {

    $.ajax({
        type        : 'GET', // define the type of HTTP verb we want to use (POST for our form)
        url         : 'http://food.dlfsystems.com:10100/posts', // the url where we want to POST
        dataType    : 'json', // what type of data do we expect back from the server
        success: function(response){
            allposts = response;
            allposts.forEach(addtoGlobMap);
            $('#donationsTable').DataTable({
                data: response,
                "columns": [
                    { "data": "title" },
                    { "data": "readiness" },
                    { "data": "pickupAddress" },
                    { "data": "creationDate",
                    "render": function (data) {
                        var date = new Date(data);
                        var month = date.getMonth() + 1;
                        return (month.length > 1 ? month : "0" + month) + "/" + date.getDate() + "/" + date.getFullYear();
                    } },
                    { "data": "_id",
                    "render": function (id){
                        return "<a href='ViewPost.html?id=" + id + "'>View</a>";
                    } }
                ]
              });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("some error");
        }});

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

function ViewPost(postId) {

                  $.ajax({
                      type        : 'GET', // define the type of HTTP verb we want to use (POST for our form)
                      url         : 'http://food.dlfsystems.com:10100/posts/' + postId, // the url where we want to POST
                      dataType    : 'json', // what type of data do we expect back from the server
                      encode          : true,
                      success: function(response){
                        $("#postTitle").text(response.title);
                        $("#title").text(response.title);
                        $("#status").text(response.status);
                        $("#readiness").text(response.readiness);
                        $("#description").text(response.description);
                        $("#pickupWindow").text(response.pickupWindow);
                        $("#pickupAddress").text(response.pickupAddress);
                        $("#creationDate").text(response.creationDate);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        alert("some error");
                    }});

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
