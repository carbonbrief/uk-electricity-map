// wrap within function called by waypoints?

var map2 = new mapboxgl.Map({
    container: 'end-map',
    style: 'https://maps.tilehosting.com/c/2d9d361b-377d-4c07-905b-31b81c65d271/styles/fiord-color-gl/style.json?key=8XzerAAi6jkvxtExTVxQ',
    center: [-9, 55],
    zoom: 5,
    maxZoom: 18
});

map2.scrollZoom.disable();

// resize map for the screen
map2.fitBounds(bounds, {padding: 10});

// include search bar first so appears at top of controls

if (screenWidth > 1200){
  map2.addControl(new MapboxGeocoder({
      accessToken: config.key1,
  }));
}

//Add zoom and rotation controls to the map.
map2.addControl(new mapboxgl.NavigationControl());