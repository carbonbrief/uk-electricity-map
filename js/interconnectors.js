map.on('load', function() {

    var filterStartYear = ['<=', ['number', ['get', 'yearStart']], 2017];
    var filterLines = ['!=', ['string', ['get','type']], 'placeholder'];
    var filterStations = ['!=', ['string', ['get','type']], 'placeholder'];

    map.addLayer({
        id: 'interconnectors',
        type: 'line',
        source: {
            type: 'geojson',
            data: './data/interconnector-lines.geojson'
        },
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": "#888",
            "line-width": 4
        }
    }, "powerplants") // to ensure that it is drawn below the powerplants layer

    map.addLayer({
        id: 'interconnector-stations',
        type: 'circle',
        source: {
            type: 'geojson',
            data: './data/interconnector-stations.geojson'
        },
        "paint": {
            "circle-color": "#888",
            "circle-radius": 5
        }
    }, "powerplants") // to ensure that it is drawn below the powerplants layer

    document.getElementById('slider').addEventListener('input', function(e) {
        var year = parseInt(e.target.value);

        filterStartYear = ['<=', ['number', ['get', 'yearStart']], year];

        map.setFilter('interconnectors', ['all', filterStartYear, filterLines]);

        map.setFilter('interconnector-stations', ['all', filterStartYear, filterStations]);

    })

    document.getElementById('selectorType').addEventListener('change', function(e) {

        var dropdown = e.target.value;

        if (dropdown === 'All') {
            filterLines = ['==', ['string', ['get','type']], 'Interconnector'];
        } else if (dropdown === 'Interconnectors') {
            filterLines = ['==', ['string', ['get','type']], 'Interconnector'];
        } else {
            filterLines = ['!=', ['string', ['get','type']], 'Interconnector'];
        };

        map.setFilter('interconnectors', ['all', filterStartYear, filterLines]);

        if (dropdown === 'All') {
            filterStations = ['==', ['string', ['get','type']], 'Interconnector'];
        } else if (dropdown === 'Interconnectors') {
            filterStations = ['==', ['string', ['get','type']], 'Interconnector'];
        } else {
            filterStations = ['!=', ['string', ['get','type']], 'Interconnector'];
        };

        map.setFilter('interconnector-stations', ['all', filterStartYear, filterStations]);
    })

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'interconnectors', function(e) {

        map.getCanvas().style.cursor = 'pointer';

        // var coordinates = e.features[0].geometry.coordinates.slice();
        var name = e.features[0].properties.name;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
        // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;

        // }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(e.lngLat)
        .setHTML('<h3>' + name + '</h3>')
        .addTo(map);

        console.log(name);

    })

    map.on('mouseleave', 'interconnectors', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
})