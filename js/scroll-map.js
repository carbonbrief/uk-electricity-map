if (!mapboxgl.supported()) {
    alert('Your browser does not support Web GL, loading simpler map instead.');

    // simple leaflet version for old browsers

    $('#console').css("display", "none");
    $("#home-button-wrapper").css("display", "none");

    var southWest = new L.LatLng(49.5, -10),
    northEast = new L.LatLng(59.5, 2),
    bounds = new L.LatLngBounds(southWest, northEast);

    var map = L.map('map', {zoomControl: true}).fitBounds(bounds, {padding: [5, 5]});

    var CartoBlue = L.tileLayer('https://cartocdn_{s}.global.ssl.fastly.net/base-midnight/{z}/{x}/{y}.png', {
        attribution: 'midnight_cartodb',
        maxZoom: 16
    }).addTo(map);

    map.scrollWheelZoom.disable();

    var group = L.layerGroup();

    function markers (data) {
        var promise = $.getJSON("data/power_stations.json");
        promise.then(function(data) {
        var markers = L.geoJSON(data, {
        filter: function (feature, layer) {
            return(feature.properties["yearEnd"] > "2016");
        },
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        onEachFeature: onEachFeature,
        style: style
        });
        group.addLayer(markers);
        });
    }

    // call markers

    markers();

    group.addTo(map);

    // find radius of marker

    function getRadius(d) {
        return d > 3200  ? 33 :
                d > 1600  ? 24 :
                d > 800  ? 17 :
                d > 400  ? 12 :
                d > 200 ? 9 :
                d > 50  ? 6.6 :
                d > 25  ? 5 :
                d > 12.5  ? 3.8 :
                        3;
    }

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

    // style of markers

    function style(feature) {
        return {
            fillColor: colors[feature.properties["type"]],
            weight: 0.4,
            opacity: 0.37,
            color: '#f3f3f3',
            fillOpacity: 0.73,
            radius: getRadius(feature.properties["capacity"])
        };
    }

    // add pop up

    function onEachFeature(feature, layer) {
        // does this feature have a property named popupContent?
        if (feature.properties) {
        layer.bindPopup('<p style= color:'+ colors[feature.properties["type"]] +';>'+feature.properties["name"]+'</h1><span class="label-title">Capacity: </span>'+feature.properties["capacity"]+' MW<br /><span class="label-title">Type: </span>'+feature.properties["fuelDetail"]+'<br /><span class="label-title">Region: </span>'+feature.properties["region"], {closeButton: false, offset: L.point(0, -20)});
            layer.on('mouseover', function() { layer.openPopup(); });
            layer.on('mouseout', function() { layer.closePopup(); });
        };
    }

} else {

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'https://maps.tilehosting.com/c/2d9d361b-377d-4c07-905b-31b81c65d271/styles/fiord-color-gl/style.json?key=' + config.key4,
        center: [-7, 54],
        zoom: 5,
        maxZoom: 18
    });

}

map.scrollZoom.disable();

// variable to use throughout
var screenWidth = $(window).width();

var boundsMobile = [
[ -9, 49],[3, 60]
]

var boundsLaptop = [
[ -11, 49],[5, 60]
]

var boundsDesktop = [
[ -13, 49],[6, 60]
]

var boundsRetina = [
[ -15, 49.5],[7, 59.5]
]

function getBounds () {
    // 850 pixels is the screen width below which the charts get hidden
    if (screenWidth > 1400) {
        return boundsRetina
    }
    else if (screenWidth > 1024 && screenWidth < 1400) {
        return boundsDesktop
    } 
    else if (1025 > screenWidth && screenWidth > 850) {
        return boundsLaptop
    } else {
        return boundsMobile
    }
}

var bounds = getBounds();

// resize map for the screen
map.fitBounds(bounds, {padding: 10});

var getYear = {
    2007: "2007",
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
var filterStartYear = ['<=', ['number', ['get', 'yearStart']], 2007];
var filterEndYear = ['>=', ['number', ['get', 'yearEnd']], 2007];
var filterType = ['!=', ['string', ['get','type']], 'placeholder'];

map.on('load', function() {

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

    map.on('mouseenter', 'powerplants', function(e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        var colorsArray = {
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
            "Gas": "#cc9b7a"
        }

        var coordinates = e.features[0].geometry.coordinates.slice();
        var name = e.features[0].properties.site;
        var capacity = e.features[0].properties.capacity;
        var type = e.features[0].properties.type;
        var fuelDetail = e.features[0].properties.fuelDetail;
        var lowCarbon = e.features[0].properties.lowCarbon;
        var operator = e.features[0].properties.operator;
        var chp = e.features[0].properties.chp;
        var open = e.features[0].properties.yearOpen;
        // match plant type to the color in colorsArray, so that the title of the tooltip changes color
        var plantColor = colorsArray[e.features[0].properties.type]; 

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

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

    map.on('mouseleave', 'powerplants', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

    // addInterconnectors();

});

// function to change map properties

function updateMap (sectionName) {
    
}

// reset dropdown on window reload

$(document).ready(function () {
    $("select").each(function () {
        $(this).val($(this).find('option[selected]').val());
    });
})