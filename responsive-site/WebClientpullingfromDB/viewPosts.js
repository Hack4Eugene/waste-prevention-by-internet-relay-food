var center = [ 44, 123 ];

var highlightedPost = null;

function toggleBounce(cope_) {

  console.log(cope_)
  if (mapMarkers[mapMarkers.length-1].getAnimation() !== null) {
    mapMarkers[mapMarkers.length-1].setAnimation(null);
  } else {
    mapMarkers[mapMarkers.length-1].setAnimation(google.maps.Animation.BOUNCE);
  }
}

//window.addEventListener('click',populateMap);

function returnGeoLocation(params){
  var get_ = new XMLHttpRequest();
  var getURL= 'https://maps.googleapis.com/maps/api/geocode/json?address='

  if (params == undefined) {
    return
  }

  params.address.replace(' ','+');

  getURL += params.address;
  getURL += '&key=AIzaSyCdFdbAfHSJHwfjRrnVtSHVtudd8x1benw';

  get_.open('GET', getURL);

  get_.addEventListener('load',function(event){

    var results = JSON.parse(event.target.response);
    console.log(results['results'][0]);
    if (results['results'][0] == undefined || results['results'][0] == null) {
      return
    }
    params.geo = results['results'][0]['geometry']['location'];

// update the global marker
    mapMarkers.push(new google.maps.Marker({
       position: params.geo,
       title: params.title,
       map: mapManifest
     }));

    mapMarkers[mapMarkers.length-1].addEventListener('click',function(event){
      console.log(mapMarkers);


    })

  });
  get_.send();


}

function populateSpecificID(postID){

  var getURL = "http://food.dlfsystems.com:10100/posts/";

  //modify our endpoint to collect the data from the debug
  getURL += postID;
  var getQuery = new XMLHttpRequest();
      getQuery.open("GET",getURL);
      //getQuery.setRequestHeader('Content-Type', 'application/json');

  //define the nature of the response.
  //this time we add all the returned items to the map.
  getQuery.addEventListener('load',function(event){
    if(event.target.status !== 200){
      console.log(event.target.response);
    }
    else{
      var results = JSON.parse(event.target.response);
      console.log("here is our database: ",results);
      addtoGlobMap(results);
      highlightedPost = results;
    }

  });
  // here we create the body to send to the server for confirmation

  getQuery.send()
  // end the post request ..

}

function addSponsor(params){

  var addPost = new XMLHttpRequest();

  var postURL = "http://food.dlfsystems.com:10100/posts";
  addPost.open("POST", postURL);

  addPost.setRequestHeader('Content-Type', 'application/json');


  addPost.addEventListener('load',function(event){
    console.log("we have returned!", event.target.response);
  });
  var body= JSON.stringify(params);

  addPost.send(body);
}




/*in this function we will record only jsut one specific detail
inputs: params = {
  title: 'string'
  or
  weight: 'string'
  or
  ..
}
*/
function populateQuery(params){
// create the post request


var getURL = "http://food.dlfsystems.com:10100/posts/search";
var getQuery = new XMLHttpRequest();
    getQuery.open("POST",getURL);
    getQuery.setRequestHeader('Content-Type', 'application/json');

//define the nature of the response.
//this time we add all the returned items to the map.
getQuery.addEventListener('load',function(event){
  results = JSON.parse(event.target.response);
  console.log('here is what they sent to us: ', event.target);
  console.log("here is our database: ",results);
  results.results.forEach(addtoGlobMap);
});
// here we create the body to send to the server for confirmation

bytestream = JSON.stringify(params);
console.log('here are our queries', bytestream);
getQuery.send(bytestream);
// end the post request ..

}

function sendQuerytoDB(){

  var queries = {
    'query': "carrots",
    'offset': 0,
    'limit': 0,
    'getNotifications': true
  };

  populateQuery(queries);

}


/*

*/
function populateMostRecent(){
  getRecent = new XMLHttpRequest();
  // create the post request
  getURL = "http://food.dlfsystems.com:10100/posts";
  getRecent.open("GET",getURL);

  //define the nature of the response.
  //this time we add all the returned items to the map.
  getRecent.addEventListener('load',function(event){
    results = JSON.parse(event.target.response);
    console.log("here is our database: ",results);
    results.forEach(addAddresstoGlobMap);
  });
  getRecent.send();
// end the post request ..


}

function addtoGlobMap (item,index){
  var str=''+ item['description']+'\t\n'+item['pickupAddress'];
  var params = { address: item['pickupAddress'], geo: null, title: str };
  returnGeoLocation(params);

}
