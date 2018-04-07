var center = [ 44, 123 ];

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




function populateMap(){
  console.log("woo");

  getRecent = new XMLHttpRequest();

  getURL = "http://food.dlfsystems.com:10100/posts";


  getRecent.open("GET",getURL);
  getRecent.addEventListener('load',function(event){
    results = JSON.parse(event.target.response);

    console.log("here is our database: ",results);

    results.forEach(select);

  });

  getRecent.send();

}

function select (item,index){
  var query = 'vegetable';

  var params = { address: item['pickupAddress'], geo: null};
  returnGeoLocation(params);



  // if(item['type'] == query){
  //   console.log("foundmatching type: ", item);
  //     mapMarkers.push(new google.maps.Marker({
  //        position: loca,
  //        map: mapManifest
  //      }));
}
