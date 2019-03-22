const $text= $('.text');
const $paddingBelow = $('.padding-below');
const $paddingAbove= $('.padding-above');
const $map = $('#map');
const $year = $('.year');
const $yearCont = $('#year-container');
const $barCont = $('#bar-container');
const $bar = $('#stacked-bar');

let $height = $(window).height();
let $width = $(window).width();

function setHeights () {

  // get new height and width in case different
  $height = $(window).height();
  $width = $(window).width();

  $map.css("height", $height);

  if ($width > 979) {
    $paddingBelow.css("height", $height*0.7);
  } else {
    // further apart since now covering the map
    $paddingBelow.css("height", $height*0.9);
  }

  $paddingAbove.css("height", ($(".year-sticky").height()* 3));

  $yearCont.css("left", function () {
    return 40 + $barCont.width();
  });

  $bar.css("height", ($height - 80));

  // for every year, loop through the text objects with the corresponding index
  // set height of year container to be equal to this
  $year.each(function(i, obj) {
    let outerHeight = 0;
    $(".text-index" + i).each(function() {
      outerHeight += $(this).outerHeight();
    });
    console.log(outerHeight);
    $(this).css("height", outerHeight + "px");
  });



}

setHeights();

$(document).ready(function() {

  window.addEventListener("resize", function(){
      setHeights();
  }, true);

  $year.each(function(){

    let _this = this;

    // grab year of element
    let year = $(this).children("h2").text();
    year = parseInt(year);

    // travelling up
    new Waypoint({
      element: _this,
      handler: function (direction) {
          if (direction == 'up') {
            console.log(year);
            filterStartYear = ['<=', ['number', ['get', 'yearStart']], year];
            filterEndYear = ['>=', ['number', ['get', 'yearEnd']], year];
            map.setFilter('powerplants', ['all', filterStartYear, filterEndYear, filterType]);
            map.setFilter('interconnectors', ['all', filterStartYear, filterLines]);
            map.setFilter('interconnector-stations', ['all', filterStartYear, filterStations]);
            updateStackedBar(year);
          }
      },
      offset: function () {
        return -this.element.clientHeight + 40 + 40;
      }
    });

    // travelling down
    new Waypoint({
      element: _this,
      handler: function (direction) {
          if (direction == 'down') {
            console.log(year);
            filterStartYear = ['<=', ['number', ['get', 'yearStart']], year];
            filterEndYear = ['>=', ['number', ['get', 'yearEnd']], year];
            map.setFilter('powerplants', ['all', filterStartYear, filterEndYear, filterType]);
            map.setFilter('interconnectors', ['all', filterStartYear, filterLines]);
            map.setFilter('interconnector-stations', ['all', filterStartYear, filterStations]);
            updateStackedBar(year);
          }
      },
      offset: 40
    });

  });

});

$(window).on('scroll', function () {

  // let scrollTop = $(this).scrollTop();
  // let mapTop = $('#main').offset().top;

  // console.log(scrollTop);
  // console.log(mapTop);

  // if (mapTop < scrollTop) {
  //   console.log("map below");
  //   $year.removeClass("active");
  // };

});

