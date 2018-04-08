/*function onFilePick(e){
    var file = e.currentTarget.files[0];

    var reader = new FileReader();
    reader.onload = (event) => {
      var contents = event.target.result;
      var digest = asmCrypto.SHA256.hex(contents);
    };

    reader.readAsArrayBuffer(file);
}*/


function CreatePost(title, amount, description, pickupWindow, pickupAddress, readiness) {
        var formData = {};
        var eligibility = [];
        $("input:checkbox[id^='eligibility-']:checked").each(function(){
            eligibility.push($(this).val());
        });

        formData['title'] = title;
        formData['status'] = 'available';
        formData['eligibility'] = eligibility;
        formData['readiness'] = readiness;
        formData['description'] = description;
        formData['pickupWindow'] = pickupWindow;
        formData['pickupAddress'] = pickupAddress;
        formData['creationDate'] = "" + new Date().toLocaleString();
        formData['user'] = "5ac8ae15982abe65368ca658";


        var json = JSON.stringify(formData);
        var authBearer = localStorage.getItem("authBearer");

        // process the form
        $.ajax({
            type        : 'POST',
            url         : 'http://food.dlfsystems.com:10100/posts',
            data        : json,
            encode          : true,
            beforeSend: function (xhr) {
                if (authBearer == "" || authBearer == undefined || authBearer == null) {
                  alert("You must be logged in to make a post!");
                }
                xhr.setRequestHeader ("Authorization", authBearer);
                xhr.setRequestHeader ("Content-Type", "application/json");
            },
            success: function(msg){
                $("#createPost h4").html("Success");
                $("#createPost form").html("Post created.");
                $("#success-buttons").show();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest.response)
                console.log(textStatus);
                console.log(errorThrown);
            }});

}

function UpdatePost(title, amount, description, pickupWindow, pickupAddress, available, readiness, eligibility) {
    var formData = {};

        formData['title'] = title;
        formData['status'] = 'available';
        formData['eligibility'] = eligibility;
        formData['readiness'] = readiness;
        formData['description'] = description;
        formData['pickupWindow'] = pickupWindow;
        formData['pickupAddress'] = pickupAddress;
        formData['creationDate'] = "" + new Date().toLocaleString();
        formData['user'] = "5ac8ae15982abe65368ca658";


    var json = JSON.stringify(formData);
    var authBearer = localStorage.getItem("authBearer");

    // process the form
    $.ajax({
        type        : 'POST',
        url         : 'http://food.dlfsystems.com:10100/posts',
        data        : json,
        encode          : true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", authBearer);
            xhr.setRequestHeader ("Content-Type", "application/json");
        },
        success: function(msg){
            $("#createPost h4").html("Success");
            $("#createPost form").html("Post created.");
            $("#success-buttons").show();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("some error");
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
                    { "data": "readiness", className: "hide-mobile" },
                    { "data": "pickupAddress", className: "hide-mobile" },
                    { "data": "creationDate", className: "hide-mobile",
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


      function GetMyPosts() {

        var authBearer = localStorage.getItem("authBearer");
        $.ajax({
            type        : 'GET', // define the type of HTTP verb we want to use (POST for our form)
            url         : 'http://food.dlfsystems.com:10100/users/posts', // the url where we want to POST
            dataType    : 'json', // what type of data do we expect back from the server
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", authBearer);
                xhr.setRequestHeader ("Content-Type", "application/json");
            },
            success: function(response){
                allposts = response;
                allposts.forEach(addtoGlobMap);
                $('#donationsTable').DataTable({
                    data: response,
                    "columns": [
                        { "data": "title" },
                        { "data": "readiness", className: "hide-mobile" },
                        { "data": "pickupAddress", className: "hide-mobile" },
                        { "data": "creationDate",
                        "render": function (data) {
                            var date = new Date(data);
                            var month = date.getMonth() + 1;
                            return (month.length > 1 ? month : "0" + month) + "/" + date.getDate() + "/" + date.getFullYear();
                        }, className: "hide-mobile" },
                        { "data": "_id",
                        "render": function (id){
                            return "<a href='ViewPost.html?id=" + id + "'>View</a> <a href='EditPost.html?id=" + id + "'>Edit</a>";
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
                        $("#title").val(response.title);
                        $("#status").text(response.status);
                        $("#amount").text(response.amount);
                        $("#amount").val(response.amount);
                        $("#readiness").text(response.readiness);
                        $("#eligibility").text(response.eligibility);
                        $("#description").text(response.description);
                        $("#description").val(response.description);
                        $("#pickupWindow").text(response.pickupWindow);
                        $("#pickupWindow").val(response.pickupWindow);
                        $("#pickupAddress").text(response.pickupAddress);
                        $("#pickupAddress").val(response.pickupAddress);
                        $("#creationDate").text(response.creationDate);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        alert("some error");
                    }});

}

function ContactDonor(subject, message) {
    var formData = {};

    formData['subject'] = subject;
    formData['message'] = message;

    var json = JSON.stringify(formData);
    var authBearer = localStorage.getItem("authBearer");

    // process the form
    $.ajax({
        type        : 'POST',
        url         : 'http://food.dlfsystems.com:10100/posts',
        data        : json,
        encode          : true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", authBearer);
            xhr.setRequestHeader ("Content-Type", "application/json");
        },
        success: function(msg){
            $("#createPost h4").html("Success");
            $("#createPost form").html("Post created.");
            $("#success-buttons").show();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.response)
            console.log(textStatus);
            console.log(errorThrown);
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
