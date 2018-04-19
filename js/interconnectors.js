map.on('load', function() {

    // I don't think it's necessary to filter yearEnd as none of the interconnectors close during this time period

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
            "line-width": 4,
            "line-opacity": 0.8
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
            "circle-radius": 5,
            "circle-opacity": 0.8
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

        // set filter for interconnector lines

        map.setFilter('interconnectors', ['all', filterStartYear, filterLines]);

        if (dropdown === 'All') {
            filterStations = ['==', ['string', ['get','type']], 'Interconnector'];
        } else if (dropdown === 'Interconnectors') {
            filterStations = ['==', ['string', ['get','type']], 'Interconnector'];
        } else {
            filterStations = ['!=', ['string', ['get','type']], 'Interconnector'];
        };

        // set filter for interconnector stations

        map.setFilter('interconnector-stations', ['all', filterStartYear, filterStations]);
    })

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'interconnectors', function(e) {

        map.getCanvas().style.cursor = 'pointer';

        var name = e.features[0].properties.name;

        // Populate the popup and set its coordinates
        // different strategy to the popup in the script.js since it's a line

        popup.setLngLat(e.lngLat)
        .setHTML('<h3>' + name + '</h3>')
        .addTo(map);

        //console.log(name);

    })

    map.on('mouseleave', 'interconnectors', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

    map.on('mouseenter', 'interconnector-stations', function(e) {

        map.getCanvas().style.cursor = 'pointer';

        var name = e.features[0].properties.site;
        var interconnector = e.features[0].properties.interconnector;

        // Populate the popup and set its coordinates
        // different strategy to the popup in the script.js since it's a line

        popup.setLngLat(e.lngLat)
        .setHTML('<h3>' + name + '</h3><p>' + interconnector + '</p>')
        .addTo(map);

        //console.log(name);

    })

    map.on('mouseleave', 'interconnector-stations', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });


})