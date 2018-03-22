map.on('load', function() {

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

})