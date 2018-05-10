mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'https://openmaptiles.github.io/fiord-color-gl-style/style-cdn.json',
    center: [-7, 54],
    zoom: 5
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

var getYear = {
  2007: "2007",
  2008: "2008",
  2009: "2009",
  2010: "2010",
  2011: "2011",
  2012: "2012",
  2013: "2013",
  2014: "2014",
  2015: "2015",
  2016: "2016",
  2017: "2017",
  2018: "Planned"
}

map.on('load', function() {


    // set to 2017 initially despite play preview or you get a bug when using the type dropdown
    var filterStartYear = ['<=', ['number', ['get', 'yearStart']], 2017];
    var filterEndYear = ['>=', ['number', ['get', 'yearEnd']], 2017];
    var filterType = ['!=', ['string', ['get','type']], 'placeholder'];

    map.addLayer({
      id: 'powerplants',
      type: 'circle',
      source: {
        type: 'geojson',
        data: './data/dummy.geojson'
      },
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['number', ['get', 'capacity']],
          // first number is the capacity and second is the size
          0, 3,
          10, 5,
          100, 11,
          1000, 21,
          10000, 35
        ],
        'circle-color': [
          'match',
          ['get', 'type'],
          "Coal", "#ced1cc",
          "Gas", "#4e80e5",
          "Solar", "#ffc83e",
          "Nuclear", "#dd54b6",
          "Oil", "#a45edb",
          "Hydro", "#43cfef",
          "Wind", "#00a98e",
          "Biomass", "#A7B734",
          "Waste", "#ea545c",
          "Other", "#cc9b7a",
          /* other */ '#ccc'
        ],
        'circle-opacity': 0.77
      },
      'filter': ['all', filterStartYear, filterEndYear, filterType]
    });

    // update hour filter when the slider is dragged
    document.getElementById('slider').addEventListener('input', function(e) {
      var year = parseInt(e.target.value);
      // update the map
      filterStartYear = ['<=', ['number', ['get', 'yearStart']], year];
      filterEndYear = ['>=', ['number', ['get', 'yearEnd']], year];
      map.setFilter('powerplants', ['all', filterStartYear, filterEndYear, filterType]); //the filter only applies to the powerplants layer

      // update text in the UI
      document.getElementById('active-hour').innerText = getYear[year];
    });

    document.getElementById('selectorType').addEventListener('change', function(e) {
      var dropdown = e.target.value;
      // update the map filter
      if (dropdown === 'All') {
        filterType = ['!=', ['string', ['get','type']], 'placeholder'];
      } else if (dropdown === 'HighCarbon') {
        filterType = ['match', ['get', 'type'], ['Coal', 'Gas', 'Oil'], true, false];
      } else if (dropdown === 'LowCarbon') {
        filterType = ['match', ['get', 'type'], ['Wind', 'Solar', 'Hydro'], true, false];
      } else if (dropdown === 'Biomass') {
        filterType = ['==', ['string', ['get','type']], 'Biomass'];
      } else if (dropdown === 'Coal') {
        filterType = ['==', ['string', ['get','type']], 'Coal'];
      } else if (dropdown === 'Gas') {
        filterType = ['==', ['string', ['get','type']], 'Gas'];
      } else if (dropdown === 'Geothermal') {
        filterType = ['==', ['string', ['get','type']], 'Geothermal'];
      } else if (dropdown === 'Hydro') {
        filterType = ['match', ['get', 'type'], ['Small Hydro', 'Large Hydro'], true, false];
      } else if (dropdown === 'Interconnectors') {
        filterType = ['==', ['string', ['get','type']], 'Interconnector'];
      } else if (dropdown === 'Nuclear') {
        filterType = ['==', ['string', ['get','type']], 'Nuclear'];
      } else if (dropdown === 'Oil') {
        filterType = ['==', ['string', ['get','type']], 'Oil'];
      } else if (dropdown === 'Other') {
        filterType = ['==', ['string', ['get','type']], 'Other'];
      } else if (dropdown === 'Solar') {
        filterType = ['==', ['string', ['get','type']], 'Solar'];
      } else if (dropdown === 'Storage') {
        filterType = ['==', ['string', ['get','type']], 'Storage'];
      } else if (dropdown === 'Waste') {
        filterType = ['==', ['string', ['get','type']], 'Waste'];
      } else if (dropdown === 'Wind') {
        filterType = ['==', ['string', ['get','type']], 'Wind'];
      } else {
        console.log('error');
      };
      map.setFilter('powerplants', ['all', filterStartYear, filterEndYear, filterType]);
    });

  // Create a popup, but don't add it to the map yet.
  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  map.on('mouseenter', 'powerplants', function(e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';

    var colorsArray = {
      "Coal": "#ced1cc",
      "Gas": "#4e80e5",
      "Solar": "#ffc83e",
      "Nuclear": "#dd54b6",
      "Oil": "#a45edb",
      "Hydro": "#43cfef",
      "Wind": "#00a98e",
      "Biomass": "#A7B734",
      "Waste": "#ea545c",
      "Other": "#cc9b7a"
    }

    var coordinates = e.features[0].geometry.coordinates.slice();
    var name = e.features[0].properties.name;
    var capacity = e.features[0].properties.capacity;
    var fuelDetail = e.features[0].properties.fuelDetail;
    // match plant type to the color in colorsArray, so that the title of the tooltip changes color
    var plantColor = colorsArray[e.features[0].properties.type]; 

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates)
        .setHTML('<h3 style = "color: ' + plantColor + ';">' + name + '</h3><p>Capacity: <b>' + capacity + ' MW</b></p><p>Type: <b>' + fuelDetail + '</b></p>')
        .addTo(map);
  });

  map.on('mouseleave', 'powerplants', function() {
      map.getCanvas().style.cursor = '';
      popup.remove();
  });

});

// reset dropdown on window reload

$(document).ready(function () {
  $("select").each(function () {
      $(this).val($(this).find('option[selected]').val());
  });
})

// INITIAL TRANSITIONS

// get slider to cycle through options once the page has loaded

setTimeout(function(){

  var i = 1;  //  set your counter to 1
  var year = 2007;

  function myLoop () {           //  create a loop function
    setTimeout(function () {    //  call a 3s setTimeout when the loop is called
        // update slider
        $("#slider").val(year);        
        // update text in the UI
        document.getElementById('active-hour').innerText = year;

        filterStartYear = ['<=', ['number', ['get', 'yearStart']], year];
        filterEndYear = ['>', ['number', ['get', 'yearEnd']], year];
        map.setFilter('powerplants', ['all', filterStartYear, filterEndYear]);

        i++;                     //  increment the counter
        year = 2007 + i;
        if (i < 11) {            //  if the counter < 11, call the loop function
          myLoop();             //  ..  again which will trigger another 
        }                        //  ..  setTimeout()
    }, 200)
  }

  myLoop();   

}, 1500);

// TOGGLE BUTTON

$(".toggle").click(function() {
  $("#console").toggleClass('console-close console-open');
  $('.arrow-right-hidden').toggleClass('arrow-right');
  $('.arrow-left').toggleClass('arrow-left-hidden');
});
