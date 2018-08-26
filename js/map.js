// Initialize and add the map
var cebuMap = {lat:  10.309576, lng: 123.893056};
var map;
var markers = [];
var searchmarkers = [];
var all_overlays = [];
var end_direction  
var directionsService
var directionsDisplay
var data1 = [['Restaurant','Restaurant\`s rating']];
var data2 = [['Restaurant', 'User check-ins', 'Users', 'Tips']];
var data3 = [[]];
var getroutes = [];
function initMap() {
    // directions
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer({
    draggable: true,
    map: map,
    panel: document.getElementById('sideDetails')
  });
  // Create the map.
  map = new google.maps.Map(document.getElementById('map'), {
    center: cebuMap,
    zoom: 12
  });

  directionsDisplay.setMap(map);
  //searchMap
  searchMap();
  //showRestaurants
  showRestaurants('Restaurant');
  //drawCapability
  drawingManager();
  generateGraph();
  window.onload = function(){
    $('.sidebar')
    .sidebar( 'show')
    document.getElementById('restaurant').onclick = function() {
      //     Your code
      getroutes = [];
      deleteAllShape();
      showRestaurants('Restaurant')
      generateGraph();
        }
        document.getElementById('coffeeshop').onclick = function() {
          //     Your code
          getroutes = [];
          deleteAllShape();
          showRestaurants('Cafe')
          generateGraph();
            }
            document.getElementById('food').onclick = function() {
              //     Your code
              getroutes = [];
              deleteAllShape();
              showRestaurants('Food')
              generateGraph();
                } 
};
  
}

function generateroutes(){
  document.getElementById('places').innerHTML = ''
  
  getroutes.forEach(function(r) {
      document.getElementById('places').innerHTML += r 
          
  });
}

function generateGraph(){
   // Load Charts and the corechart package.
   google.charts.load('current', {'packages':['corechart']});

      google.charts.setOnLoadCallback(drawHistoChart2);
   google.charts.setOnLoadCallback(drawHistoChart);
   generateroutes()


}



function drawHistoChart2(options, divname){
  var data = google.visualization.arrayToDataTable(data2);
  var options = {
    title: '[Constant graph] - Number of checkins, users and tips',
    legend: { position: 'top', maxLines: 2 },
    colors: ['#5C3292', '#1A8763', '#871B47', '#999999'],
    interpolateNulls: false,
    'width':470,
    'height':300
  
  };
  var sideDetails = document.getElementById('sideDetails');
  sideDetails.classList.add("ui");
  sideDetails.classList.add("card");
  sideDetails.innerHTML = ``
  sideDetails.innerHTML += `
  <div id="data2" style="width: 470px; height: 300px;"></div>`

  var chart = new google.visualization.Histogram(document.getElementById('data2'));
  chart.draw(data, options);
}
function drawHistoChart(options, divname){
  var data = google.visualization.arrayToDataTable(data1);
  options = {
    title: '[Active graph] - Number of Restaurant/Food/Cafe that corresponds to rating',
    legend: { position: 'top', maxLines: 1 },
    colors: ['#4285F4'],
    interpolateNulls: false,
    'width':470,
    'height':300

  };
  var sideDetails = document.getElementById('sideDetails');
  sideDetails.classList.add("ui");
  sideDetails.classList.add("card");

  sideDetails.innerHTML += `
  <div id="data1" style="width: 470px; height: 300px;"></div>`

  var chart = new google.visualization.Histogram(document.getElementById('data1'));
  chart.draw(data, options);
}
function generateInfoWindowContent(content){
 if ( content.opening_hours && typeof content.opening_hours != "undefined"){
  var branchopen = "Closed";
  if (content.opening_hours.open_now == true){
    branchopen = "Open";
  }
  return `<div class='container'><b>`+ content.name +`</b><br /> address: `+ content.vicinity +`<br /> rating: ` + content.rating +`<br /> ` + branchopen + `</div>` 

 }else{
  return `<div class='container'><b>`+ content.name +`</b><br /> address: `+ content.vicinity +`<br /> rating: ` + content.rating + `</div>` 

 }

}

function generateSideBarcontent(content, data){
  var branchopen = "N/A";
  if ( content.opening_hours &&  content.opening_hours !== "undefined"){
    var branchopen = "N/A";
    if (content.opening_hours.open_now == true){
      branchopen = "Open";
    }else{
      branchopen = "Closed";
    }
  }
var count = 0;
  if (data.response.venues[0].stats.checkinsCount !== undefined && typeof data.response.venues[0].stats.checkinsCount != undefined){
    count = data.response.venues[0].stats.checkinsCount
  }
  var sideDetails = document.getElementById('sideDetails');
  sideDetails.classList.add("ui");
  sideDetails.classList.add("card");
  sideDetails.innerHTML = `
  <div class='content'>
    <div class='header'><b>`+content.name  +`</b></div>  
    <div class="description">
      <p>address:<b> `+ content.formatted_address +`</b></p>
      <p>phone: <b>`+ content.formatted_phone_number +`</b></p>
      <p>rating: ` +content.rating+`<div class="ui rating" data-rating="`+ Math.round(content.rating) +`" data-max-rating="5"></div></p>
      
      <p>no. of visits: <b>`+ count  +`</b></p>
      <p><b>`+ branchopen +`</b></p>
      <hr>
      <p>website: <b>`+ content.website +`</b></p>
    </div>
  </div> 
  <div class="extra content">
    <div class="right floated author">
      <button class ="ui red button"  id="getDirections">Get directions</button>
    </div>
  </div>
  </div>`
  var elat = content.geometry.location.lat();
  var elng = content.geometry.location.lng();
  end_direction = {lat: elat, lng: elng};
  bindingFunction(content);
  
}


function calcRoute() {
  //var selectedMode = document.getElementById('mode').value;
  var request = {
      origin: cebuMap,
      destination: end_direction,
      // Note that Javascript allows us to access the constant
      // using square brackets and a string value as its
      // "property."
      travelMode: google.maps.TravelMode['WALKING']
  };
  directionsService.route(request, function(response, status) {
    if (status == 'OK') {

      clearMarkers(markers);
      clearMarkers(searchmarkers);
      directionsDisplay.setDirections(response);
     
    }
  });
}
function bindingFunction(data){
  $('.ui.rating')
  .rating()
; 
  document.getElementById('getDirections').onclick = function() {
//     Your code
calcRoute();
  }

}


function changeContent(){
  $('.sidebar')
  .sidebar( 'show')
}
function closableContent(){
  $('.sidebar')
  .sidebar( 'show')
  .sidebar('setting', 'closable', false)
}

function hideContent(){
  $('.sidebar')
  .sidebar('hide')
}
function markerFunctions(marker, infowindow, content){
  var infocontent = generateInfoWindowContent(content);
  
  marker.addListener('mouseover', function() {
    infowindow.setContent(infocontent);
    infowindow.open(map, this);
  });

  marker.addListener('mouseout', function() {
      infowindow.close();
  });

  marker.addListener('click', function(){
    //directionsDisplay.setMap(null);
    directionsDisplay.set('directions', null);
    closableContent()
    searchMapViaId(content.place_id, function(trueContent){
     
    })
  });
}

function generateCheckins(data){
  
  data2 = [['Restaurant', 'User check-ins', 'Users', 'Tips']];
  for (var i = 0, venue; venue = data.response.venues[i]; i++) {
    insert = [venue.name, venue.stats.checkinsCount, venue.stats.usersCount, venue.stats.tipCount]
    data2.push(insert)
  //response.venues[0].stats.checkinsCount
  }
  
}

function createMarkers(places) {
  
  var bounds = new google.maps.LatLngBounds();
  var placesList = document.getElementById('places');
  var urlicon="";
  placesList.innerHTML = "";
  for (var i = 0, place; place = places[i]; i++) {
    // analytics
    insert = [place.name, place.rating]
    data1.push(insert)
    if (place.types.includes('cafe')){
      //urlicon='https://image.flaticon.com/icons/svg/35/35101.svg'
      urlicon='http://maps.google.com/mapfiles/kml/pal2/icon54.png'
    }else{
      //urlicon='https://i1.wp.com/hentiesbaytourism.com/wp-content/uploads/2016/06/restaurant_marker.png'
      urlicon='http://maps.google.com/mapfiles/kml/pal2/icon34.png'
      
    }
    var image = {
      url: urlicon,

      scaledSize: new google.maps.Size(45, 45)
    };

 
    var infowindow = new google.maps.InfoWindow();
    //var infowindowContent = document.getElementById('infowindow-content');

    //infowindow.setContent(infowindowContent);
    var marker = new google.maps.Marker({
      map: map,
      icon: image,
      class:'open button',
      position: place.geometry.location
    });
    marker.addListener('click', changeContent);
    //populateData(infowindowContent,place.icon,place.name,place.address)  
    
    markerFunctions(marker, infowindow, place);
    markers.push(marker);

    getroutes.push('<li><a  onclick=searchMapViaId("'+ place.place_id +'")>'+ place.name +'</a></li>');
    bounds.extend(place.geometry.location);
  }
  map.fitBounds(bounds);

  //get checkin for graph
  getCheckins("10.309576,123.893056", 'none', '20', function(checkin) {

    generateCheckins(checkin);
});
generateGraph();
}


function showRestaurants(rtype){
  directionsDisplay.set('directions', null);
  
  //hideContent();
  cleanrightBar();
  deleteMarkers(markers);
  var rightHeader = document.getElementById('rightHeader');
  rightHeader.innerHTML = rtype;
  rtype = rtype.toLowerCase();
  // Create the places service.
  var service = new google.maps.places.PlacesService(map);
  var getNextPage = null;
  var moreButton = document.getElementById('more');
  moreButton.onclick = function() {
    moreButton.disabled = true;
    if (getNextPage) getNextPage();
  };
  if (moreButton.disabled == true){

    data1 = [['Restaurant','Restaurant\`s rating']];
  }else{
    
  }
  // Perform a nearby search.
  service.nearbySearch(
      {location: cebuMap, radius: 5000, type: [rtype]},
      function(results, status, pagination) {
        if (status !== 'OK') return;
        
        createMarkers(results);
        moreButton.disabled = !pagination.hasNextPage;
        getNextPage = pagination.hasNextPage && function() {
          pagination.nextPage();
        };  
      });
}
function searchMapViaId(placeId){
  var service = new google.maps.places.PlacesService(map);
  service.getDetails({
    placeId: placeId
  }, function(place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      //console.log(place)
      getCheckins(place.geometry.location.toUrlValue(5), place.name, '1', function(checkin) {

        generateSideBarcontent(place, checkin);
});
    }
  });
}

function searchMap(){
    
    var input = document.getElementById('pac-input');
    var types = "Restaurant";
    var autocomplete = new google.maps.places.Autocomplete(input);
  
    autocomplete.bindTo('bounds', map);
  
      var infowindow = new google.maps.InfoWindow();
      var infowindowContent = document.getElementById('infowindow-content');
      infowindow.setContent(infowindowContent);
      var marker = new google.maps.Marker({
      map: map,
      class:'open button',
      anchorPoint: new google.maps.Point(0, -29)
      });
      
    autocomplete.addListener('place_changed', function() {
    infowindow.close();
    deleteAllShape();
    clearMarkers(markers);
    
  
    marker.setVisible(false);
    var rightHeader = document.getElementById('places');
    rightHeader.innerHTML = '';
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }
   
    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
    searchmarkers.push(marker);
    showMarkers(searchmarkers);

    searchMapViaId(place.place_id, function(trueContent){
      
    })
    markerFunctions(marker, infowindow, place);

  });
  infowindow.addListener('closeclick', function(){
    deleteMarkers(searchmarkers);
    showMarkers(markers);

  });
}

function populateData(infowindowContent,picon, pname,paddr){
    infowindowContent.children['place-icon'].src = picon;
    infowindowContent.children['place-name'].textContent = pname;
    infowindowContent.children['place-address'].textContent = paddr;
}

// Sets the map on all markers in the array.
function setMapOnAll(map, markerArray) {
  for (var i = 0; i < markerArray.length; i++) {
    markerArray[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers(markertoHide) {
  setMapOnAll(null, markertoHide);
}

// Shows any markers currently in the array.
function showMarkers(markerstoShow) {
  setMapOnAll(map, markerstoShow);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers(markertoDelete) {
  if(markertoDelete.length > 0){
    clearMarkers(markertoDelete);
    markertoDelete = [];
  }

}

function cleanrightBar(){
    var element = document.getElementById('places');
    //var element = document.getElementById("top");
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }

}

function drawingManager(){

  directionsDisplay.set('directions', null);
  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.MARKER,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [ 'circle']
    },
    markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
    circleOptions: {
      fillColor: '#000',
      fillOpacity: .3,
      strokeWeight: 1,
      clickable: false,
      editable: true,
      zIndex: 1
    }
  });
  
  drawingManager.setMap(map);
  drawingManager.setDrawingMode(null);

  google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
    all_overlays.push(event);
    drawingManager.setDrawingMode(null);
    if (event.type == 'circle') {
      var radius = event.overlay.getRadius();
      var lat = event.overlay.getCenter().lat();
      var lng = event.overlay.getCenter().lng();

    }else{
    //  console.log(event.overlay.getMap().center.lat());
     // console.log(event.overlay.getMap().center.lng());
    }
    
    drawingManager.setDrawingMode(null);
    
    showRestaurantsDraw(radius,lat,lng);
  });
  
  google.maps.event.addListener(drawingManager, 'drawingmode_changed', function(event) {

  directionsDisplay.set('directions', null);
    if ( all_overlays.length > 1) {
      all_overlays[0].overlay.setMap(null);
      
      all_overlays.shift();
      
    }
  });
}

function deleteAllShape() {
  for (var i = 0; i < all_overlays.length; i++) {
    all_overlays[i].overlay.setMap(null);
  }
  all_overlays = [];
}

function showRestaurantsDraw(radius,lat,lng){
  
 
  cleanrightBar();
  deleteMarkers(markers);
  var rightHeader = document.getElementById('rightHeader');
  rightHeader.innerHTML = 'Restaurant';
  // Create the places service.
  var service = new google.maps.places.PlacesService(map);
  var getNextPage = null;
  var moreButton = document.getElementById('more');
  moreButton.onclick = function() {
    moreButton.disabled = true;
    if (getNextPage) getNextPage();
  };
  if (moreButton.disabled == true){

    data1 = [['Restaurant','Restaurant\`s rating']];
  }else{
    
  }
  // Perform a nearby search.
  service.nearbySearch(
      {location: {lat:  lat, lng: lng}, radius: radius, type: ['restaurant']},
      function(results, status, pagination) {
        if (status !== 'OK') return;
        createMarkers(results);
        moreButton.disabled = !pagination.hasNextPage;
        getNextPage = pagination.hasNextPage && function() {
          pagination.nextPage();
        };  
      });
      
}

function getCheckins(latlng,name,limit, callback){
var url = "https://api.foursquare.com/v2/venues/search";
var data ={
  intent: 'match',
  ll: latlng,
  name: name,
  limit:limit, 
  oauth_token : "SEDEULG4BHJCIHRMH55HK0WIEDD2ZENRJG0MYYEHOBL3PVNQ",
  v : '20180823'}

if (limit != "1"){
  var url = "https://api.foursquare.com/v2/venues/search";
var data ={
  intent: 'checkin',
  ll: latlng,
  limit:limit, 
  oauth_token : "SEDEULG4BHJCIHRMH55HK0WIEDD2ZENRJG0MYYEHOBL3PVNQ",
  v : '20180823'}
}
  $.ajax({
    url: url,
    type: "get",
    data: data,
    success: function(data){
      callback(data);

    }
  });
};

