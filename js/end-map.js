// wrap within function called by waypoints?

var map2 = new mapboxgl.Map({
    container: 'end-map',
    style: 'https://maps.tilehosting.com/c/2d9d361b-377d-4c07-905b-31b81c65d271/styles/fiord-color-gl/style.json?key=8XzerAAi6jkvxtExTVxQ',
    center: [-7, 55],
    zoom: 5,
    maxZoom: 18
});

map2.scrollZoom.disable();

var boundsMobile2 = [
    [ -9, 49],[2, 60]
    ]
    
var boundsLaptop2 = [
[ -11, 49],[2, 60]
]

var boundsDesktop2 = [
[ -13, 49],[2, 60]
]

var boundsRetina2 = [
[ -14, 49.5],[3, 59.5]
]

function getBounds2 () {
    // 850 pixels is the screen width below which the charts get hidden
    if (screenWidth > 1400) {
        return boundsRetina2
    }
    else if (screenWidth > 1024 && screenWidth < 1400) {
        return boundsDesktop2
    } 
    else if (1025 > screenWidth && screenWidth > 850) {
        return boundsLaptop2
    } else {
        return boundsMobile2
    }
}

var bounds2 = getBounds2();

// resize map for the screen
map2.fitBounds(bounds2, {padding: 10});

// include search bar first so appears at top of controls

if (screenWidth > 1200){
    map2.addControl(new MapboxGeocoder({
        accessToken: config.key1,
    }));
}

//Add zoom and rotation controls to the map.
map2.addControl(new mapboxgl.NavigationControl());

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

    map2.addLayer({
        id: 'powerplants2',
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

map2.on('load', function() {

    // update hour filter when the slider is dragged
    document.getElementById('slider').addEventListener('input', function(e) {
        var year = parseInt(e.target.value);
        // update the map
        filterStartYear = ['<=', ['number', ['get', 'yearStart']], year];
        filterEndYear = ['>=', ['number', ['get', 'yearEnd']], year];
        map2.setFilter('powerplants2', ['all', filterStartYear, filterEndYear, filterType]); //the filter only applies to the powerplants layer

        // update text in the UI
        document.getElementById('active-hour').innerText = getYear[year];

        // updateTotal();

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
        map2.setFilter('powerplants2', ['all', filterStartYear, filterEndYear, filterType]);

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

        map2.setStyle(basemap);

        // update text in the UI
        document.getElementById('map-type').innerText = [dropdown];

    })

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map2.on('mouseenter', 'powerplants2', function(e) {
        // Change the cursor style as a UI indicator.
        map2.getCanvas().style.cursor = 'pointer';

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
        var name = e.features[0].properties.site;
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
            .addTo(map2);
    });

    map2.on('mouseleave', 'powerplants2', function() {
        map2.getCanvas().style.cursor = '';
        popup.remove();
    });

});

map2.on('style.load', function () {
    // Triggered when `setStyle` is called.
    addDataLayers();
    // addInterconnectors();
});

// reset dropdown on window reload

$(document).ready(function () {
    $("select").each(function () {
        $(this).val($(this).find('option[selected]').val());
    });
})