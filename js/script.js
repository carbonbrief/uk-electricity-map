mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-1.3, 52],
    zoom: 5
});

map.on('load', function() {

    var filterStartYear = ['<=', ['number', ['get', 'yearStart']], 2017];
    var filterEndYear = ['>', ['number', ['get', 'yearEnd']], 2017];
    var filterType = ['!=', ['string', ['get','type']], 'placeholder'];

    map.addLayer({
      id: 'collisions',
      type: 'circle',
      source: {
        type: 'geojson',
        data: './data/dummy.geojson'
      },
      paint: {
        'circle-radius': [
          'interpolate',
          ['exponential', 1.2],
          ['number', ['get', 'capacity']],
          0, 3,
          1000, 25
        ],
        'circle-color': [
          'interpolate',
          ['linear'],
          ['number', ['get', 'capacity']],
          0, '#2DC4B2',
          5, '#3BB3C3',
          10, '#669EC4',
          50, '#8B88B6',
          100, '#A2719B',
          500, '#AA5E79'
        ],
        'circle-opacity': 0.8
      },
      'filter': ['all', filterStartYear, filterEndYear, filterType]
    }, 'admin-2-boundaries-dispute');

    // update hour filter when the slider is dragged
    document.getElementById('slider').addEventListener('input', function(e) {
      var year = parseInt(e.target.value);
      // update the map
      filterStartYear = ['<=', ['number', ['get', 'yearStart']], year];
      filterEndYear = ['>', ['number', ['get', 'yearEnd']], year];
      map.setFilter('collisions', ['all', filterStartYear, filterEndYear, filterType]);

      // update text in the UI
      document.getElementById('active-hour').innerText = year;
    });

    document.getElementById('selectorType').addEventListener('change', function(e) {
      var dropdown = e.target.value;
      // update the map filter
      if (dropdown === 'All') {
        filterType = ['!=', ['string', ['get','type']], 'placeholder'];
      } else if (dropdown === 'HighCarbon') {
        filterType = ['==', ['string', ['get','type']], 'Coal'];
      } else if (dropdown === 'LowCarbon') {
        filterType = ['==', ['string', ['get','type']], 'Gas'];
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
        filterType = ['==', ['string', ['get','type']], 'Interconnectors'];
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
      map.setFilter('collisions', ['all', filterStartYear, filterEndYear, filterType]);
    });

    // Create a popup, but don't add it to the map yet.
  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  map.on('mouseenter', 'collisions', function(e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';

    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.name;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
  });

  map.on('mouseleave', 'collisions', function() {
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
