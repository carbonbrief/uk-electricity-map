const $text= $('.scrolltext');
const $paddingBelow = $('.padding-below');
const $paddingAbove= $('.padding-above');
const $map = $('#map');
const $endMap = $('#end-map');
const $year = $('.year');
const $yearCont = $('#year-container');
const $barCont = $('#bar-container');
const $bar = $('#stacked-bar');

let $height = $(window).height();
let $width = $(window).width();

let year;

function setHeights () {

  // get new height and width in case different
  $height = $(window).height();
  $width = $(window).width();

  $map.css("height", $height);
  $endMap.css("height", $height);

  if ($width > 979) {
    $paddingBelow.css("height", $height*0.7);
  } else {
    // further apart since now covering the map
    $paddingBelow.css("height", $height*0.9);
  }

  $paddingAbove.css("height", ($(".year-sticky").height()* 5));

  $yearCont.css("left", function () {
    return 40 + $barCont.width();
  });

  $bar.css("height", ($height - 80));

  // for every year, loop through the text objects with the corresponding index
  // set height of year container to be equal to this
  $year.each(function(i, obj) {
    let outerHeight = 0;
    $(".index" + i).each(function() {
      outerHeight += $(this).outerHeight();
    });
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

    // travelling up
    new Waypoint({
      element: _this,
      handler: function (direction) {
          if (direction == 'up') {

            // grab year of element
            year = $(_this).children("h2").text();
            year = parseInt(year);

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

            // grab year of element
            year = $(_this).children("h2").text();
            year = parseInt(year);

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

  $text.each(function () {

    // fade text on and off screen

    let _this = this;

    new Waypoint({
      element: _this,
      handler: function (direction) {
        if (direction == 'down'){
            $(this.element).animate({'opacity': 1});
        } else {
          $(this.element).animate({'opacity': 0.15});
        }
      },
      offset: '85%'
    });

    // ensure text coming on to the screen is faded
    new Waypoint({
      element: _this,
      handler: function (direction) {
        if (direction == 'down'){
            $(this.element).css({'opacity': 0.15});
        }
      },
      offset: '110%'
    });

    new Waypoint({
      element: _this,
      handler: function (direction) {
        if (direction == 'down'){
            $(this.element).animate({'opacity': 0.15});
        } else {
          $(this.element).animate({'opacity': 1});
        }
      },
      offset: '10%'
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

// scroll to top on window reload
window.onbeforeunload = function () {
  window.scrollTo(0,0);
};


// TOGGLE BUTTON

$(".toggle").click(function(e) {

  // stop from scrolling to the top
  e.preventDefault();

  $("#console").toggleClass('console-close console-open');
  $('.arrow-right-hidden').toggleClass('arrow-right');
  $('.arrow-left').toggleClass('arrow-left-hidden');
  
});
