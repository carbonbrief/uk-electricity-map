mapboxgl.accessToken = 'pk.eyJ1Ijoicm9zcGVhcmNlIiwiYSI6ImNpdm1sczJsZjAwOGMyeW1xNHc4ejJ0N28ifQ.4B24e0_HgfJj4sgqimETqA';

var map = new mapboxgl.Map({
  container: 'map', // container element id
  style: 'mapbox://styles/mapbox/light-v9',
  center: [-74.0059, 40.7128], // initial map center in [lon, lat]
  zoom: 12
});

map.on('load', function() {
    map.addLayer({
      id: 'collisions',
      type: 'circle',
      source: {
        type: 'geojson',
        data: './data/collisions1601.geojson' // replace this with the url of your own geojson
      },
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['number', ['get', 'Casualty']],
          0, 4,
          5, 24
        ],
        'circle-color': [
          'interpolate',
          ['linear'],
          ['number', ['get', 'Casualty']],
          0, '#2DC4B2',
          1, '#3BB3C3',
          2, '#669EC4',
          3, '#8B88B6',
          4, '#A2719B',
          5, '#AA5E79'
        ],
        'circle-opacity': 0.8
      },
      filter: ['==', ['number', ['get', 'Hour']], 12]
    }, 'admin-2-boundaries-dispute');
  });
