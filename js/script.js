mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-1.3, 52],
    zoom: 5
});

map.on('load', function() {

    var filterStartYear = ['<', ['number', ['get', 'yearStart']], 2017];
    var filterEndYear = ['>', ['number', ['get', 'yearEnd']], 2017];
    var filterRenewable = ['!=', ['string', ['get','isRenewable']], 'placeholder'];

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
      //'filter': ['all', filterYear, filterDay]
    }, 'admin-2-boundaries-dispute');

    // update hour filter when the slider is dragged
    document.getElementById('slider').addEventListener('input', function(e) {
      var year = parseInt(e.target.value);
      // update the map
      filterStartYear = ['<', ['number', ['get', 'yearStart']], year];
      filterEndYear = ['>', ['number', ['get', 'yearEnd']], year];
      map.setFilter('collisions', ['all', filterStartYear, filterEndYear, filterRenewable]);

      // // converting 0-23 hour to AMPM format
      // var ampm = year >= 12 ? 'PM' : 'AM';
      // var hour12 = hour % 12 ? hour % 12 : 12;

      // update text in the UI
      document.getElementById('active-hour').innerText = year;
    });

    document.getElementById('filters').addEventListener('change', function(e) {
      var radio = e.target.value;
      // update the map filter
      if (radio === 'all') {
        filterRenewable = ['!=', ['string', ['get','isRenewable']], 'placeholder'];
      } else if (radio === 'renewable') {
        filterRenewable = ['match', ['get', 'isRenewable'], ['Renewable'], true, false];
      } else if (radio === 'nonrenewable') {
        filterRenewable = ['match', ['get', 'isRenewable'], ['Non-renewable'], true, false];
      } else {
        console.log('error');
      };
      map.setFilter('collisions', ['all', filterStartYear, filterEndYear, filterRenewable]);
    });

});
  
