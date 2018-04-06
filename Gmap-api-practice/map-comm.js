


window.addEventListener('click', addMoreMarkers);

//add more makrers:
// desc: adding a marker to the map after it has been loaded.
// inputs: none, event toggled.
// post-conditions: a couple more markers on the map.
function addMoreMarkers(){
  console.log(myMap)

  var other = {lat: -26.0, lng:133.0 };
  var marker1 = new google.maps.Marker({
    position: other,
    map: myMap[0]
  });


}
