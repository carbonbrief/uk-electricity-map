mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'https://openmaptiles.github.io/fiord-color-gl-style/style-cdn.json',
    center: [-2.5, 53.5],
    zoom: 5
});

map.on('load', function() {

    var filterStartYear = ['<=', ['number', ['get', 'yearStart']], 2017];
    var filterEndYear = ['>', ['number', ['get', 'yearEnd']], 2017];
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
        'circle-opacity': 0.8
      },
      'filter': ['all', filterStartYear, filterEndYear, filterType]
    });

    // update hour filter when the slider is dragged
    document.getElementById('slider').addEventListener('input', function(e) {
      var year = parseInt(e.target.value);
      // update the map
      filterStartYear = ['<=', ['number', ['get', 'yearStart']], year];
      filterEndYear = ['>', ['number', ['get', 'yearEnd']], year];
      map.setFilter('powerplants', ['all', filterStartYear, filterEndYear, filterType]); //the filter only applies to the powerplants layer

      // update text in the UI
      document.getElementById('active-hour').innerText = year;
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

    var coordinates = e.features[0].geometry.coordinates.slice();
    var name = e.features[0].properties.name;
    var capacity = e.features[0].properties.capacity;
    var fuelType = e.features[0].properties.type;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates)
        .setHTML('<h3>' + name + '</h3><p>' + capacity + ' MW</p><p>' + fuelType + '</p>')
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
