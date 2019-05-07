var colors = {
    "Coal": "#ced1cc",
    "Storage": "#4e80e5",
    "Solar": "#ffc83e",
    "Nuclear": "#dd54b6",
    "Oil": "#a45edb",
    "Hydro": "#43cfef",
    "Wave & Tidal": "#43cfef",
    "Wind": "#00a98e",
    "Biomass": "#A7B734",
    "Waste": "#ea545c",
    "Gas": "#cc9b7a",
}

if (!mapboxgl.supported()) {

    alert('Your browser does not support Web GL, loading simpler map instead.');
    
} else {

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'https://api.maptiler.com/maps/e7270a26-c7e8-420d-bb9c-dee843aa7bfe/style.json?key=' + config.key3,
        center: [-7, 54],
        zoom: 5,
        maxZoom: 18,
        interactive: false
    });

}

var boundsMobile = [
[ -9, 49],[3, 61]
]

var boundsLaptop = [
[ -11, 49],[4, 61]
]

var boundsDesktop = [
[ -12, 49],[5.5, 61]
]

var boundsRetina = [
[ -14, 49],[6.5, 61]
]

function getBounds () {
    // 850 pixels is the screen width below which the charts get hidden
    if ($width > 1400) {
        return boundsRetina
    }
    else if ($width > 1100 && $width < 1400) {
        return boundsDesktop
    } 
    else if (1101 > $width && $width > 850) {
        return boundsLaptop
    } else {
        return boundsMobile
    }
}

var bounds = getBounds();

// resize map for the screen
map.fitBounds(bounds, {padding: 5});

var getYear = {
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
    2018: "2018",
    2019: "Planned"
}

// declare filters
// set to 2017 initially despite play preview or you get a bug when using the type dropdown
var filterStartYear = ['<=', ['number', ['get', 'yearStart']], 2008];
var filterEndYear = ['>=', ['number', ['get', 'yearEnd']], 2008];
var filterType = ['!=', ['string', ['get','type']], 'placeholder'];
var filterOperator = ['!=', ['string', ['get','operator']], 'placeholder'];

map.on('load', function() {

    // underlay to remain when filtering
    map.addLayer({
        id: 'underlay',
        type: 'circle',
        source: {
        type: 'geojson',
        data: './data/power_stations.json'
        },
        paint: {
        'circle-radius': {
            property: 'capacity',
            type: 'exponential',
            base: 0.8,
            stops: [
            [{zoom: 2, value: 1}, 0.5],
            [{zoom: 2, value: 2500}, 18],
            [{zoom: 4.5, value: 1}, 2.2],
            [{zoom: 4.5, value: 2500}, 27],
            [{zoom: 8, value: 1}, 4],
            [{zoom: 8, value: 2500}, 32],
            [{zoom: 12, value: 1}, 6],
            [{zoom: 12, value: 2500}, 37],
            [{zoom: 15, value: 1}, 8],
            [{zoom: 15, value: 2500}, 42]
            ]
        },
        'circle-color': [
            'match',
            ['get', 'type'],
            "Coal", "#ced1cc",
            "Storage", "#4e80e5",
            "Solar", "#ffc83e",
            "Nuclear", "#dd54b6",
            "Oil", "#a45edb",
            "Hydro", "#43cfef",
            "Wave & Tidal", "#43cfef",
            "Wind", "#00a98e",
            "Biomass", "#A7B734",
            "Waste", "#ea545c",
            "Gas", "#cc9b7a",
            /* other */ '#ccc'
        ],
        'circle-opacity': 0.15
        },
        'filter': ['all', filterStartYear, filterEndYear, filterType]
    });

    map.addLayer({
        id: 'powerplants',
        type: 'circle',
        source: {
        type: 'geojson',
        data: './data/power_stations.json'
        },
        paint: {
        'circle-radius': {
            property: 'capacity',
            type: 'exponential',
            base: 0.8,
            stops: [
            [{zoom: 2, value: 1}, 0.5],
            [{zoom: 2, value: 2500}, 18],
            [{zoom: 4.5, value: 1}, 2.2],
            [{zoom: 4.5, value: 2500}, 27],
            [{zoom: 8, value: 1}, 4],
            [{zoom: 8, value: 2500}, 32],
            [{zoom: 12, value: 1}, 6],
            [{zoom: 12, value: 2500}, 37],
            [{zoom: 15, value: 1}, 8],
            [{zoom: 15, value: 2500}, 42]
            ]
        },
        'circle-color': [
            'match',
            ['get', 'type'],
            "Coal", "#ced1cc",
            "Storage", "#4e80e5",
            "Solar", "#ffc83e",
            "Nuclear", "#dd54b6",
            "Oil", "#a45edb",
            "Hydro", "#43cfef",
            "Wave & Tidal", "#43cfef",
            "Wind", "#00a98e",
            "Biomass", "#A7B734",
            "Waste", "#ea545c",
            "Gas", "#cc9b7a",
            /* other */ '#ccc'
        ],
        'circle-opacity': 0.77
        },
        'filter': ['all', filterStartYear, filterEndYear, filterType]
    });

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    let coordinates;
    let name;
    let capacity;
    let type;
    let fuelDetail;
    let lowCarbon;
    let operator;
    let chp;
    let open;
    let plantColor; 

    function getFuel () {
        if (fuelDetail == "-") {
            return type
        } else if (type == "Wind" || type =="Hydro") {
            return fuelDetail
        } else {
            return type + ", " + fuelDetail
        }
    }

    // selectively include CHP in tooltip
    function getCHP () {
        if (chp == "-") {
            return " ";
        } else {
            return '</p><p><span class="label-title">Combined heat and power? </span>' + chp;
        }
    }

    // ensures that numbers with decimals places are rounded to 1fp but numbers without aren't given one
    function roundToOne(num) {    
        return +(Math.round(num + "e+1")  + "e-1");
    }

    if ($width > 736) {

        map.on('mouseenter', 'powerplants', function(e) {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';
    
            coordinates = e.features[0].geometry.coordinates.slice();
            name = e.features[0].properties.site;
            capacity = e.features[0].properties.capacity;
            type = e.features[0].properties.type;
            fuelDetail = e.features[0].properties.fuelDetail;
            lowCarbon = e.features[0].properties.lowCarbon;
            operator = e.features[0].properties.operator;
            chp = e.features[0].properties.chp;
            open = e.features[0].properties.yearOpen;
            plantColor = colors[e.features[0].properties.type]; 
    
            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
    
            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(coordinates)
                .setHTML('<h3 style = "color: ' + plantColor + '; border-bottom: 1px solid ' + plantColor + ';">' + name + 
                '</h3><div class="colour-key" style="background-color: ' + plantColor + '; margin-right: 5px;"></div><p class="inline">' + getFuel() + 
                '</p><p><span class="label-title">Capacity: </span>' + roundToOne(capacity) + 
                ' <span class="units">MW</span></p><p><span class="label-title">Low carbon? </span>' + lowCarbon + 
                getCHP() +
                '</p><p><span class="label-title">Operator: </span>' + operator + 
                '</p><p><span class="label-title">Year opened: </span>' + open + 
                '</p>')
                .addTo(map);
        });
    
        // adding mousemove behaviour improves UX when moving across overlapping plants
        map.on('mousemove', 'powerplants', function(e) {
    
            coordinates = e.features[0].geometry.coordinates.slice();
            name = e.features[0].properties.site;
            capacity = e.features[0].properties.capacity;
            type = e.features[0].properties.type;
            fuelDetail = e.features[0].properties.fuelDetail;
            lowCarbon = e.features[0].properties.lowCarbon;
            operator = e.features[0].properties.operator;
            chp = e.features[0].properties.chp;
            open = e.features[0].properties.yearOpen;
            plantColor = colors[e.features[0].properties.type]; 
    
            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
    
            // change the contents of the popup based on the feature found
            popup.setLngLat(coordinates)
                .setHTML('<h3 style = "color: ' + plantColor + '; border-bottom: 1px solid ' + plantColor + ';">' + name + 
                '</h3><div class="colour-key" style="background-color: ' + plantColor + '; margin-right: 5px;"></div><p class="inline">' + getFuel() + 
                '</p><p><span class="label-title">Capacity: </span>' + roundToOne(capacity) + 
                ' <span class="units">MW</span></p><p><span class="label-title">Low carbon? </span>' + lowCarbon + 
                getCHP() +
                '</p><p><span class="label-title">Operator: </span>' + operator + 
                '</p><p><span class="label-title">Year opened: </span>' + open + 
                '</p>');
        });
    
        map.on('mouseleave', 'powerplants', function() {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });

    }

});

// function to change map properties

function updateMap (sectionName) {

    // suspect that might need to deal with each stage individually 
    // if some involve map filters and some involve flyTo

    if (sectionName == "section2") {
        filterOperator = ['==', ['string', ['get','operator']], 'Drax Power Ltd'];
    } else {
        filterOperator = ['!=', ['string', ['get','operator']], 'placeholder'];
    }

    map.setFilter('powerplants', ['all', filterOperator, filterType, filterStartYear, filterEndYear]);
    
}

// reset dropdown on window reload

$(document).ready(function () {
    $("select").each(function () {
        $(this).val($(this).find('option[selected]').val());
    });
})