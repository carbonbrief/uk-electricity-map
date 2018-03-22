map.on('load', function() {

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

    document.getElementById('selectorType').addEventListener('change', function(e) {

        var dropdown = e.target.value;

        if (dropdown === 'All') {
            filterLines = ['==', ['string', ['get','type']], 'Interconnector'];
        } else if (dropdown === 'Interconnectors') {
            filterLines = ['==', ['string', ['get','type']], 'Interconnector'];
        } else {
            filterLines = ['!=', ['string', ['get','type']], 'Interconnector'];
        };

        map.setFilter('interconnectors', ['all', filterLines]);

        if (dropdown === 'All') {
            filterStations = ['==', ['string', ['get','type']], 'Interconnector'];
        } else if (dropdown === 'Interconnectors') {
            filterStations = ['==', ['string', ['get','type']], 'Interconnector'];
        } else {
            filterStations = ['!=', ['string', ['get','type']], 'Interconnector'];
        };

        map.setFilter('interconnector-stations', ['all', filterStations]);
    })
})