
function CreateUser(username, email, role) {
// get the form data
        // there are many ways to get this data using jQuery (you can use the class or id also)
        var formData = {
            'username': username,
            'role': role,
            'email': email,
            'created': Date.now()
        };

        // process the form
        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : 'food.dlfsystems.com:10100/users', // the url where we want to POST
            data        : formData, // our data object
            dataType    : 'json', // what type of data do we expect back from the server
            encode          : true,
            success: function(msg){
                alert( "Data Saved: " + msg );
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("some error");
            }
        });

}

function LogoutUser() {
    localStorage.setItem("currentUser", null);
}

function LoginUser() {
    
}

function LoadUserFromSession() {
    var user = localStorage.getItem("currentUser");
}

function AddUserToSession(username, role, email) {
    var user = {
        username: username,
        email: email,
        role: role
    };
    localStorage.setItem("currentUser",JSON.stringify(user));
}
        