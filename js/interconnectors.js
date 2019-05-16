// declare filters

// I don't think it's necessary to filter yearEnd as none of the interconnectors close during this time period

//var filterStartYear = ['<=', ['number', ['get', 'yearStart']], 2007];
var filterLines = ['!=', ['string', ['get','type']], 'placeholder'];
var filterStations = ['!=', ['string', ['get','type']], 'placeholder'];

map.on('load', function() {

    map.addLayer({
        id: 'interconnectors',
        type: 'line',
        source: {
            type: 'geojson',
            data: './data/interconnector-lines.json'
        },
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": "#ff8767",
            "line-width": {
                'property': 'capacity',
                type: 'exponential',
                base: 0.8,
                'stops': [
                    [{zoom: 2, value: 100}, 1],
                    [{zoom: 2, value: 2000}, 5],
                    [{zoom: 8, value: 100}, 2],
                    [{zoom: 8, value: 2000}, 6],
                    [{zoom: 14, value: 100}, 3],
                    [{zoom: 14, value: 2000}, 7],
                    [{zoom: 20, value: 100}, 4],
                    [{zoom: 20, value: 2000}, 8]
                ]
            },
            "line-opacity": 0.8
        }
    }, "powerplants"); // to ensure that it is drawn below the powerplants layer

    map.addLayer({
        id: 'interconnector-stations',
        type: 'circle',
        source: {
            type: 'geojson',
            data: './data/interconnector-stations.json'
        },
        "paint": {
            "circle-color": "#ff8767",
            // make circles larger as the user zooms
            'circle-radius': {
                'stops': [[3, 4], [20, 15]]
            },
            "circle-opacity": 0.8
        }
    }, "powerplants"); // to ensure that it is drawn below the powerplants layer

    map.setFilter('interconnector-stations', ['all', filterStartYear, filterStations]);
    map.setFilter('interconnectors', ['all', filterStartYear, filterLines]);

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    let name;
    let operator;
    let connecting;
    let yearOpen;
    let capacity;

    let converter;
    let interconnector;
    let country;

    if ($width > 736) {

        map.on('mouseenter', 'interconnectors', function(e) {

            map.getCanvas().style.cursor = 'pointer';
    
            name = e.features[0].properties.name;
            operator = e.features[0].properties.operator;
            connecting = e.features[0].properties.connecting;
            yearOpen = e.features[0].properties.yearOpen;
            capacity = e.features[0].properties.capacity;
    
            // Populate the popup and set its coordinates
            // different strategy to the popup in the script.js since it's a line
    
            popup.setLngLat(e.lngLat)
            .setHTML('<h3 style="color: #ff8767; border-bottom: 1px solid #ff8767;">' + name + 
            '</h3><div class="colour-key" style="background-color: #ff8767; margin-right: 5px;"></div><p class="inline">Interconnector' +
            '</p><p><span class="label-title">Capacity: </span>' + capacity +
            ' <span class="units">MW</span></p><p><span class="label-title">Operator: </span>' + operator +
            '</p><p><span class="label-title">Connecting: </span>' + connecting +
            '</p><p><span class="label-title">Year opened: </span>' + yearOpen +
            '</p>')
            .addTo(map);
    
        });
    
        map.on('mousemove', 'interconnectors', function(e) {
    
            name = e.features[0].properties.name;
            operator = e.features[0].properties.operator;
            connecting = e.features[0].properties.connecting;
            yearOpen = e.features[0].properties.yearOpen;
            capacity = e.features[0].properties.capacity;
    
            popup.setLngLat(e.lngLat)
            .setHTML('<h3 style="color: #ff8767; border-bottom: 1px solid #ff8767;">' + name + 
            '</h3><div class="colour-key" style="background-color: #ff8767; margin-right: 5px;"></div><p class="inline">Interconnector' +
            '</p><p><span class="label-title">Capacity: </span>' + capacity +
            ' <span class="units">MW</span></p><p><span class="label-title">Operator: </span>' + operator +
            '</p><p><span class="label-title">Connecting: </span>' + connecting +
            '</p><p><span class="label-title">Year opened: </span>' + yearOpen +
            '</p>');
    
        });
    
        map.on('mouseleave', 'interconnectors', function() {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });
    
        map.on('mouseenter', 'interconnector-stations', function(e) {
    
            map.getCanvas().style.cursor = 'pointer';
    
            converter = e.features[0].properties.site;
            interconnector = e.features[0].properties.interconnector;
            country = e.features[0].properties.country;
    
            popup.setLngLat(e.lngLat)
            .setHTML('<h3 style="color: #ff8767; border-bottom: 1px solid #ff8767;">' + converter + 
            '</h3><p><span class="label-title">Interconnector: </span>' + interconnector + 
            '</p><p><span class="label-title">Country: </span>' + country +
            '</p>')
            .addTo(map);
    
        });
    
        map.on('mouseleave', 'interconnector-stations', function() {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });

    }

});

// add interconnectors to second map

map2.on('load', function() {

    document.getElementById('slider').addEventListener('input', function(e) {
        var year = parseInt(e.target.value);

        filterStartYear2 = ['<=', ['number', ['get', 'yearStart']], year];

        map2.setFilter('interconnectors', ['all', filterStartYear2, filterLines]);

        map2.setFilter('interconnector-stations', ['all', filterStartYear2, filterStations]);

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

        map2.setFilter('interconnectors', ['all', filterStartYear2, filterLines]);

        if (dropdown === 'All') {
            filterStations = ['==', ['string', ['get','type']], 'Interconnector'];
        } else if (dropdown === 'Interconnectors') {
            filterStations = ['==', ['string', ['get','type']], 'Interconnector'];
        } else {
            filterStations = ['!=', ['string', ['get','type']], 'Interconnector'];
        };

        // set filter for interconnector stations

        map2.setFilter('interconnector-stations', ['all', filterStartYear2, filterStations]);
    })

    

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    let name;
    let operator;
    let connecting;
    let yearOpen;
    let capacity;

    let converter;
    let interconnector;
    let country;

    function getOpen () {
        if (yearOpen < 2019 ) {
            return '<span class="label-title">Year opened: </span>' + yearOpen;
        } else {
            return '<span class="label-title">Planned for: </span>' + yearOpen;
        }
    }

    map2.on('mouseenter', 'interconnectors', function(e) {

        map2.getCanvas().style.cursor = 'pointer';

        name = e.features[0].properties.name;
        operator = e.features[0].properties.operator;
        connecting = e.features[0].properties.connecting;
        yearOpen = e.features[0].properties.yearOpen;
        capacity = e.features[0].properties.capacity;

        popup.setLngLat(e.lngLat)
        .setHTML('<h3 style="color: #ff8767; border-bottom: 1px solid #ff8767;">' + name + 
        '</h3><div class="colour-key" style="background-color: #ff8767; margin-right: 5px;"></div><p class="inline">Interconnector' +
        '</p><p><span class="label-title">Capacity: </span>' + capacity +
        ' <span class="units">MW</span></p><p><span class="label-title">Operator: </span>' + operator +
        '</p><p><span class="label-title">Connecting: </span>' + connecting +
        '</p><p>' + getOpen() +
        '</p>')
        .addTo(map2);

    });

    map2.on('mousemove', 'interconnectors', function(e) {

        name = e.features[0].properties.name;
        operator = e.features[0].properties.operator;
        connecting = e.features[0].properties.connecting;
        yearOpen = e.features[0].properties.yearOpen;
        capacity = e.features[0].properties.capacity;

        popup.setLngLat(e.lngLat)
        .setHTML('<h3 style="color: #ff8767; border-bottom: 1px solid #ff8767;">' + name + 
        '</h3><div class="colour-key" style="background-color: #ff8767; margin-right: 5px;"></div><p class="inline">Interconnector' +
        '</p><p><span class="label-title">Capacity: </span>' + capacity +
        ' <span class="units">MW</span></p><p><span class="label-title">Operator: </span>' + operator +
        '</p><p><span class="label-title">Connecting: </span>' + connecting +
        '</p><p>' + getOpen() +
        '</p>');

    });

    map2.on('mouseleave', 'interconnectors', function() {
        map2.getCanvas().style.cursor = '';
        popup.remove();
    });

    map2.on('mouseenter', 'interconnector-stations', function(e) {

        map2.getCanvas().style.cursor = 'pointer';

        converter = e.features[0].properties.site;
        interconnector = e.features[0].properties.interconnector;
        country = e.features[0].properties.country;

        popup.setLngLat(e.lngLat)
        .setHTML('<h3 style="color: #ff8767; border-bottom: 1px solid #ff8767;">' + converter + 
        '</h3><p><span class="label-title">Interconnector: </span>' + interconnector + 
        '</p><p><span class="label-title">Country: </span>' + country +
        '</p>')
        .addTo(map2);

    });

    map2.on('mouseleave', 'interconnector-stations', function() {
        map2.getCanvas().style.cursor = '';
        popup.remove();
    });


});

// use for second map

function addInterconnectors () {

    // add data layers when set style is called

    map2.addLayer({
        id: 'interconnectors',
        type: 'line',
        source: {
            type: 'geojson',
            data: './data/interconnector-lines.json'
        },
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": "#ff8767",
            "line-width": {
                'property': 'capacity',
                type: 'exponential',
                base: 0.8,
                'stops': [
                    [{zoom: 2, value: 100}, 1],
                    [{zoom: 2, value: 2000}, 5],
                    [{zoom: 8, value: 100}, 2],
                    [{zoom: 8, value: 2000}, 6],
                    [{zoom: 14, value: 100}, 3],
                    [{zoom: 14, value: 2000}, 7],
                    [{zoom: 20, value: 100}, 4],
                    [{zoom: 20, value: 2000}, 8]
                ]
            },
            "line-opacity": 0.8
        }
    }, "powerplants2"); // to ensure that it is drawn below the powerplants2 layer

    map2.addLayer({
        id: 'interconnector-stations',
        type: 'circle',
        source: {
            type: 'geojson',
            data: './data/interconnector-stations.json'
        },
        "paint": {
            "circle-color": "#ff8767",
            // make circles larger as the user zooms
            'circle-radius': {
                'stops': [[3, 4], [20, 15]]
            },
            "circle-opacity": 0.8
        }
    }, "powerplants2"); // to ensure that it is drawn below the powerplants2 layer

    map2.setFilter('interconnector-stations', ['all', filterStartYear2, filterStations]);
    map2.setFilter('interconnectors', ['all', filterStartYear2, filterLines]);


}