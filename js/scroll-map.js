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
    var promise = $.getJSON("data/dummy.geojson");
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
    "Gas": "#4e80e5",
    "Solar": "#ffc83e",
    "Nuclear": "#dd54b6",
    "Oil": "#a45edb",
    "Hydro": "#43cfef",
    "Wind": "#00a98e",
    "Biomass": "#A7B734",
    "Waste": "#ea545c",
    "Other": "#cc9b7a",
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
    layer.bindPopup('<h3 style= color:'+ colors[feature.properties["type"]] +';>'+feature.properties["name"]+'</h1><span class="label-title">Capacity: </span>'+feature.properties["capacity"]+' MW<br /><span class="label-title">Type: </span>'+feature.properties["fuelDetail"]+'<br /><span class="label-title">Region: </span>'+feature.properties["region"], {closeButton: false, offset: L.point(0, -20)});
        layer.on('mouseover', function() { layer.openPopup(); });
        layer.on('mouseout', function() { layer.closePopup(); });
    };
}

} else {

var map = new mapboxgl.Map({
    container: 'map',
    style: 'https://maps.tilehosting.com/c/2d9d361b-377d-4c07-905b-31b81c65d271/styles/fiord-color-gl/style.json?key=8XzerAAi6jkvxtExTVxQ',
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

// only include search barf first so appears at top of controls

// if (screenWidth > 1200){
//   map.addControl(new MapboxGeocoder({
//       accessToken: config.key1,
//   }));
// }

// Add zoom and rotation controls to the map.
// map.addControl(new mapboxgl.NavigationControl());

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
2018: "Planned"
}

// declare filters
// set to 2017 initially despite play preview or you get a bug when using the type dropdown
var filterStartYear = ['<=', ['number', ['get', 'yearStart']], 2017];
var filterEndYear = ['>=', ['number', ['get', 'yearEnd']], 2017];
var filterType = ['!=', ['string', ['get','type']], 'placeholder'];

var baseLayers = [{
    label: 'Dark',
    id: 'https://maps.tilehosting.com/c/2d9d361b-377d-4c07-905b-31b81c65d271/styles/fiord-color-gl/style.json?key=8XzerAAi6jkvxtExTVxQ'
}, {
    label: 'Light',
    id: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
},{
    label: "Satellite",
    id: {
        "version": 8,
        "sources": {
            "simple-tiles": {
                "type": "raster",
                // point to our third-party tiles. Note that some examples
                // show a "url" property. This only applies to tilesets with
                // corresponding TileJSON (such as mapbox tiles). 
                "tiles": [
                    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                ],
                "tileSize": 256,
                attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.'
            }
        },
        "layers": [{
            "id": "simple-tiles",
            "type": "raster",
            "source": "simple-tiles",
            "minzoom": 0,
            "maxzoom": 22
        }]
    }
}];

function addDataLayers () {

    map.addLayer({
        id: 'powerplants',
        type: 'circle',
        source: {
        type: 'geojson',
        data: './data/dummy.geojson'
        },
        paint: {
        'circle-radius': {
            property: 'capacity',
            type: 'exponential',
            base: 0.8,
            stops: [
            [{zoom: 2, value: 1}, 0.5],
            [{zoom: 2, value: 2500}, 18],
            [{zoom: 4.5, value: 1}, 3],
            [{zoom: 4.5, value: 2500}, 27],
            [{zoom: 8, value: 1}, 4.5],
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
            "Gas", "#4e80e5",
            "Solar", "#ffc83e",
            "Nuclear", "#dd54b6",
            "Oil", "#a45edb",
            "Hydro", "#43cfef",
            "Wind", "#00a98e",
            "Biomass", "#A7B734",
            "Waste", "#ea545c",
            "Other", "#cc9b7a",
            /* other */ '#ccc'
        ],
        'circle-opacity': 0.77
        },
        'filter': ['all', filterStartYear, filterEndYear, filterType]
    });

}

map.on('load', function() {

    // update hour filter when the slider is dragged
    document.getElementById('slider').addEventListener('input', function(e) {
        var year = parseInt(e.target.value);
        // update the map
        filterStartYear = ['<=', ['number', ['get', 'yearStart']], year];
        filterEndYear = ['>=', ['number', ['get', 'yearEnd']], year];
        map.setFilter('powerplants', ['all', filterStartYear, filterEndYear, filterType]); //the filter only applies to the powerplants layer

        // update text in the UI
        document.getElementById('active-hour').innerText = getYear[year];

        updateTotal();

    });

    document.getElementById('selectorType').addEventListener('change', function(e) {
        var dropdown = e.target.value;
        // update the map filter
        if (dropdown === 'All') {
            filterType = ['!=', ['string', ['get','type']], 'placeholder'];
        } else if (dropdown === 'HighCarbon') {
            filterType = ['match', ['get', 'type'], ['Coal', 'Gas', 'Oil'], true, false];
        } else if (dropdown === 'LowCarbon') {
            filterType = ['match', ['get', 'type'], ['Wind', 'Solar', 'Hydro'], true, false];
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
            filterType = ['==', ['string', ['get','type']], 'Interconnector'];
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
        map.setFilter('powerplants', ['all', filterStartYear, filterEndYear, filterType]);

        updateTotal();
    });

    document.getElementById("selectorStyle").addEventListener("change", function(e){
        // update variables
        dropdown = e.target.value;

        // get id from array using the dropdown variable
        var basemap = baseLayers.find(function(x) {
            return x.label === dropdown;
        }).id;

        // console.log(basemap);

        map.setStyle(basemap);

        // update text in the UI
        document.getElementById('map-type').innerText = [dropdown];

    })

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
        "Gas": "#4e80e5",
        "Solar": "#ffc83e",
        "Nuclear": "#dd54b6",
        "Oil": "#a45edb",
        "Hydro": "#43cfef",
        "Wind": "#00a98e",
        "Biomass": "#A7B734",
        "Waste": "#ea545c",
        "Other": "#cc9b7a"
        }

        var coordinates = e.features[0].geometry.coordinates.slice();
        var name = e.features[0].properties.name;
        var capacity = e.features[0].properties.capacity;
        var fuelDetail = e.features[0].properties.fuelDetail;
        // match plant type to the color in colorsArray, so that the title of the tooltip changes color
        var plantColor = colorsArray[e.features[0].properties.type]; 

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates)
            .setHTML('<h3 style = "color: ' + plantColor + ';">' + name + 
            '</h3><p><span class="label-title">Capacity: </span>' + capacity + 
            ' MW</p><p><span class="label-title">Type: </span>' + fuelDetail + 
            '</p>')
            .addTo(map);
    });

    map.on('mouseleave', 'powerplants', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

});

map.on('style.load', function () {
    // Triggered when `setStyle` is called.
    addDataLayers();
    addInterconnectors();
});

// reset dropdown on window reload

$(document).ready(function () {
$("select").each(function () {
    $(this).val($(this).find('option[selected]').val());
});
})

// INITIAL TRANSITIONS

// get slider to cycle through options once the page has loaded

setTimeout(function(){

var i = 1;  //  set your counter to 1
var year = 2007;

function myLoop () {           //  create a loop function
    setTimeout(function () {    //  call a 3s setTimeout when the loop is called
        // update slider
        $("#slider").val(year);        
        // update text in the UI
        document.getElementById('active-hour').innerText = year;

        filterStartYear = ['<=', ['number', ['get', 'yearStart']], year];
        filterEndYear = ['>', ['number', ['get', 'yearEnd']], year];
        map.setFilter('powerplants', ['all', filterStartYear, filterEndYear]);

        i++;                     //  increment the counter
        year = 2007 + i;
        if (i < 11) {            //  if the counter < 11, call the loop function
        myLoop();             //  ..  again which will trigger another 
        }                        //  ..  setTimeout()
    }, 200)
}

myLoop();   

}, 1500);

// TOGGLE BUTTON

$(".toggle").click(function() {
$("#console").toggleClass('console-close console-open');
$('.arrow-right-hidden').toggleClass('arrow-right');
$('.arrow-left').toggleClass('arrow-left-hidden');
});

// HOME BUTTON

$("#home-button").click(function() {
map.flyTo({
    center: [-7, 54],
    zoom: 5,
    bearing: 0,
    pitch: 0,
    speed: 1,
    animate: true
});
})

// PROMPT BEHAVIOURS

// select random number between 1 and 3
var randomWrapper = Math.floor((Math.random() * 3) + 1);

console.log(randomWrapper);

if (screenWidth > 980) {
    var promptTimeout = setTimeout(function() {
        // randomly show a different prompt each time
        $("#prompt-wrapper" + randomWrapper).toggleClass("prompt-in prompt-out");
    }, 8000);
}

// clear timeout when the user start interacting with the map, so not distracting
$(document).one("mousedown", function () {
    clearTimeout(promptTimeout);
    console.log("clear timeout");
})

setTimeout(function() {
    $(".prompt-wrapper").removeClass("prompt-in");
    $(".prompt-wrapper").addClass("prompt-fade");
}, 23000);

$(".prompt-wrapper").mousemove(function() {
    $(".prompt-wrapper").removeClass("prompt-in");
    $(".prompt-wrapper").addClass("prompt-out");
})
