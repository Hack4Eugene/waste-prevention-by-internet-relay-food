var center = [ 44, 123 ];

var highlightedPost = null

//window.addEventListener('click',populateMap);

function returnGeoLocation(params){
  var get_ = new XMLHttpRequest();
  var getURL= 'https://maps.googleapis.com/maps/api/geocode/json?address='

  params.address.replace(' ','+');

  getURL += params.address;
  getURL += '&key=AIzaSyCdFdbAfHSJHwfjRrnVtSHVtudd8x1benw';

  get_.open('GET', getURL);

  get_.addEventListener('load',function(event){

    var results = JSON.parse(event.target.response);
    params.geo = results['results'][0]['geometry']['location'];

    mapMarkers.push(new google.maps.Marker({
       position: params.geo,
       map: mapManifest
     }));

  });
  get_.send();


}

var db = [
  { 'location': [ 46, 123 ],
    'type': 'vegetable',
    'food': 'beets',
    'owner': 'n/a'
  },
  { 'location': [ 42, 123 ],
    'type': 'vegetable',
    'food': 'carrots',
    'owner': 'n/a'
  },
  { 'location': [ 44, 126 ],
    'type': 'vegetable',
    'food': 'lettuce',
    'owner': 'n/a'
  },
  { 'location': [ 44, 120 ],
    'type': 'vegetable',
    'food': 'cucumber',
    'owner': 'n/a'
  },
  { 'location': [ 44, 120 ],
    'type': 'meat',
    'food': 'bacon',
    'owner': 'n/a'
  },
  { 'location': [ 47, 126 ],
    'type': 'fruit',
    'food': 'orange',
    'owner': 'n/a'
  }
];


function catchJustOne(postID){

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
      console.log("!not found")
      console.log(event.target)
      console.log(event.target.response);
    }
    console.log(event.target.response);
    var results = JSON.parse(event.target.response);
    console.log("here is our database: ",results);
    addtoGlobMap(results.results);
    highlightedPost = results;

  });
  // here we create the body to send to the server for confirmation

  getQuery.send()
  // end the post request ..

}


// var post0 = {
// 'userid': '584bc9ba420a6b189c510af6',
//   "creationDate": "2018-04-20",
//    "title": "are ye hungry for fun?",
//   "status": "available",
//   "eligibility": [
//     "business"
//   ],
//   "amount": "20",
//   "readiness": "harvestable",
//   "description": "a primetime showcase of fun!",
//   "pickupWindow": "Thursday 4/12, 10-2",
//   "pickupAddress": "1290 Oak St, Eugene, OR"
// }

function addSponsor(params){

  var addPost = new XMLHttpRequest();

  var postURL = "http://food.dlfsystems.com:10100/posts";
  addPost.open("POST",postURL);

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
function mapQuerySelector(params){
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

  mapQuerySelector(queries);

}


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
    results.forEach(addtoGlobMap);
  });
  getRecent.send();
// end the post request ..


}

function addtoGlobMap (item,index){
  var params = { address: item['pickupAddress'], geo: null};
  returnGeoLocation(params);

}