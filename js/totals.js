var totals = [
    {
        "year": 2007,
        "All": "x",
        "Low Carbon": "x",
        "High Carbon": "xx",
        "Biomass": "xxx",
        "Coal": "xxxx",
        "Gas": "xxxxx",
        "Hydro": "xxxxxx",
        "Interconnectors": "xxxxxxx",
        "Nuclear": "xxxxxxxx",
        "Oil": "xxxxxxxx",
        "Other": "xxxxxxxx",
        "Solar": "xxxxxxxx",
        "Wind": "xxxxxxxx",
        "Waste": "xxxxxxxx"
    },
    {
        "year": 2008,
        "All": "y",
        "Low Carbon": "y",
        "High Carbon": "yy",
        "Biomass": "y",
        "Coal": "y",
        "Gas": "yy",
        "Hydro": "yyyy",
        "Interconnectors": "yyy",
        "Nuclear": "yyy",
        "Oil": "yyyyyyy",
        "Other": "yyyyyyy",
        "Solar": "yyyyyyy",
        "Wind": "yyyyyyy",
        "Waste": "yyyyyyy"
    },
    {
        "year": 2009,
        "All": "x",
        "Low Carbon": "x",
        "High Carbon": "xx",
        "Biomass": "xxx",
        "Coal": "xxxx",
        "Gas": "xxxxx",
        "Hydro": "xxxxxx",
        "Interconnectors": "xxxxxxx",
        "Nuclear": "xxxxxxxx",
        "Oil": "xxxxxxxx",
        "Other": "xxxxxxxx",
        "Solar": "xxxxxxxx",
        "Wind": "xxxxxxxx",
        "Waste": "xxxxxxxx"
    },
    {
        "year": 2010,
        "All": "y",
        "Low Carbon": "y",
        "High Carbon": "yy",
        "Biomass": "y",
        "Coal": "y",
        "Gas": "yy",
        "Hydro": "yyyy",
        "Interconnectors": "yyy",
        "Nuclear": "yyy",
        "Oil": "yyyyyyy",
        "Other": "yyyyyyy",
        "Solar": "yyyyyyy",
        "Wind": "yyyyyyy",
        "Waste": "yyyyyyy"
    },
    {
        "year": 2011,
        "All": "x",
        "Low Carbon": "x",
        "High Carbon": "xx",
        "Biomass": "xxx",
        "Coal": "xxxx",
        "Gas": "xxxxx",
        "Hydro": "xxxxxx",
        "Interconnectors": "xxxxxxx",
        "Nuclear": "xxxxxxxx",
        "Oil": "xxxxxxxx",
        "Other": "xxxxxxxx",
        "Solar": "xxxxxxxx",
        "Wind": "xxxxxxxx",
        "Waste": "xxxxxxxx"
    },
    {
        "year": 2012,
        "All": "y",
        "Low Carbon": "y",
        "High Carbon": "yy",
        "Biomass": "y",
        "Coal": "y",
        "Gas": "yy",
        "Hydro": "yyyy",
        "Interconnectors": "yyy",
        "Nuclear": "yyy",
        "Oil": "yyyyyyy",
        "Other": "yyyyyyy",
        "Solar": "yyyyyyy",
        "Wind": "yyyyyyy",
        "Waste": "yyyyyyy"
    },
    {
        "year": 2013,
        "All": "x",
        "Low Carbon": "x",
        "High Carbon": "xx",
        "Biomass": "xxx",
        "Coal": "xxxx",
        "Gas": "xxxxx",
        "Hydro": "xxxxxx",
        "Interconnectors": "xxxxxxx",
        "Nuclear": "xxxxxxxx",
        "Oil": "xxxxxxxx",
        "Other": "xxxxxxxx",
        "Solar": "xxxxxxxx",
        "Wind": "xxxxxxxx",
        "Waste": "xxxxxxxx"
    },
    {
        "year": 2014,
        "All": "y",
        "Low Carbon": "y",
        "High Carbon": "yy",
        "Biomass": "y",
        "Coal": "y",
        "Gas": "yy",
        "Hydro": "yyyy",
        "Interconnectors": "yyy",
        "Nuclear": "yyy",
        "Oil": "yyyyyyy",
        "Other": "yyyyyyy",
        "Solar": "yyyyyyy",
        "Wind": "yyyyyyy",
        "Waste": "yyyyyyy"
    },
    {
        "year": 2015,
        "All": "x",
        "Low Carbon": "x",
        "High Carbon": "xx",
        "Biomass": "xxx",
        "Coal": "xxxx",
        "Gas": "xxxxx",
        "Hydro": "xxxxxx",
        "Interconnectors": "xxxxxxx",
        "Nuclear": "xxxxxxxx",
        "Oil": "xxxxxxxx",
        "Other": "xxxxxxxx",
        "Solar": "xxxxxxxx",
        "Wind": "xxxxxxxx",
        "Waste": "xxxxxxxx"
    },
    {
        "year": 2016,
        "All": "y",
        "Low Carbon": "y",
        "High Carbon": "yy",
        "Biomass": "y",
        "Coal": "y",
        "Gas": "yy",
        "Hydro": "yyyy",
        "Interconnectors": "yyy",
        "Nuclear": "yyy",
        "Oil": "yyyyyyy",
        "Other": "yyyyyyy",
        "Solar": "yyyyyyy",
        "Wind": "yyyyyyy",
        "Waste": "yyyyyyy"
    },
    {
        "year": 2017,
        "All": "x",
        "Low Carbon": "x",
        "High Carbon": "xx",
        "Biomass": "xxx",
        "Coal": "xxxx",
        "Gas": "xxxxx",
        "Hydro": "xxxxxx",
        "Interconnectors": "xxxxxxx",
        "Nuclear": "xxxxxxxx",
        "Oil": "xxxxxxxx",
        "Other": "xxxxxxxx",
        "Solar": "xxxxxxxx",
        "Wind": "xxxxxxxx",
        "Waste": "xxxxxxxx"
    },
    {
        "year": 2018,
        "All": "y",
        "Low Carbon": "y",
        "High Carbon": "yy",
        "Biomass": "y",
        "Coal": "y",
        "Gas": "yy",
        "Hydro": "yyyy",
        "Interconnectors": "yyy",
        "Nuclear": "yyy",
        "Oil": "yyyyyyy",
        "Other": "yyyyyyy",
        "Solar": "yyyyyyy",
        "Wind": "yyyyyyy",
        "Waste": "yyyyyyy"
    }
]

function updateTotal () {

    var yearSlider = document.getElementById('slider').value;
    type = document.getElementById('selectorType').value;
    var newArray;

    // console.log(yearSlider);
    // console.log(type);

    var newArray = totals.filter(function(x) {
      return x.year === parseInt(yearSlider);
    });

    // console.log(newArray);

    var total = newArray[0][type];

   document.getElementById('total').innerText = total;
    
}