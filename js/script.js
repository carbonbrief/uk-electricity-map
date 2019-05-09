const $text= $('.scrolltext');
const $paddingBelow = $('.padding-below');
const $paddingAbove= $('.padding-above');
const $map = $('#map');
const $mapCont = $('#map-container');
const $textCont = $('#text-container');
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

  if ($width < 737) {
    // try to deal with address bar hiding when scroll down on mobile
    // resulting in gap at bottom
    $map.css("height", "100vh");
  } else {
    $map.css("height", $height);
  }
  $endMap.css("height", $height - 30);

  if ($width > 979) {
    $paddingBelow.css("height", $height*0.8);
    $paddingAbove.css("height", $height*0.8);
  } else {
    // further apart since now covering the map
    $paddingBelow.css("height", $height*0.9);
    $paddingAbove.css("height", $height*0.9);
  }

  //$paddingAbove.css("height", ($(".year-sticky").height()* 5));

  function getYearPadding () {
    if ($width > 736 && $width < 1281) {
      return 30;
    } else if ($width < 737) {
      return 0;
    } else {
      return 40;
    }
  };

  if ($width > 736) {
    $yearCont.css("left", function () {
      return getYearPadding() + $barCont.width();
    });
  } else if ($width < 737 && $width > 480 ) {
    $yearCont.css("left", function () {
      return ($width/2 - ($yearCont.width()/2) - 25);
    });
  } else {
    // different margin to account for
    $yearCont.css("left", function () {
      return ($width/2 - ($yearCont.width()/2) - 15);
    });
  };

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

  // set map container height to ensure same when position becomes absolute on small screen
  // after have set other things like padding

  $mapCont.css("height", $textCont.height() + 240);

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
            if (year == "Future") {
              year = "2019";
            }
            year = parseInt(year);

            filterStartYear = ['<=', ['number', ['get', 'yearStart']], year];
            filterEndYear = ['>=', ['number', ['get', 'yearEnd']], year];
            filterType = ['!=', ['string', ['get','type']], 'placeholder'];
            filterOperator = ['!=', ['string', ['get','operator']], 'placeholder'];

            map.setFilter('underlay', ['all', filterStartYear, filterEndYear, filterType, filterOperator]);
            map.setFilter('powerplants', ['all', filterStartYear, filterEndYear, filterType, filterOperator]);
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
            if (year == "Future") {
              year = 2019;
            }
            year = parseInt(year);

            filterStartYear = ['<=', ['number', ['get', 'yearStart']], year];
            filterEndYear = ['>=', ['number', ['get', 'yearEnd']], year];
            filterType = ['!=', ['string', ['get','type']], 'placeholder'];
            filterOperator = ['!=', ['string', ['get','operator']], 'placeholder'];

            map.setFilter('underlay', ['all', filterStartYear, filterEndYear, filterType, filterOperator]);
            map.setFilter('powerplants', ['all', filterStartYear, filterEndYear, filterType, filterOperator]);
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
    let sectionName = $(this).attr('id');

    new Waypoint({
      element: _this,
      handler: function (direction) {
        if (direction == 'down'){
          $(this.element).animate({'opacity': 1});
          updateMap(sectionName);
        } else {
          $(this.element).animate({'opacity': 0.15});
        }
      },
      offset: '50%'
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
          updateMap(sectionName);
        }
      },
      offset: '10%'
    });

  });

  let $share = $(".share-icons");

  new Waypoint({
    element: document.getElementById('end-map'),
    handler: function(direction) {
      if (direction == 'down'){
        $share.css("visibility", "hidden");
      } else {
        $share.css("visibility", "visible");
      }
    },
    offset: 35
  });

  let $button = $("#credit-button");

  new Waypoint({
    element: document.getElementById('explore'),
    handler: function(direction) {
      if (direction == 'down'){
        $button.removeClass("bottom");
        $button.addClass("floating");
        $("#credit-jump").html("<i class='fas fa-chevron-down'></i>");
        creditState = 0;
      } else {
        $button.addClass("bottom");
        $button.removeClass("floating");
        $("#credit-jump").html("<i class='fas fa-chevron-up'></i>");
        creditState = 1;
      }
    },
    offset: "50%"
  });

  new Waypoint({
    element: document.getElementById('credits'),
    handler: function(direction) {
      if (direction == 'down'){
        $button.addClass("bottom");
        $button.removeClass("floating");
        $("#credit-jump").html("<i class='fas fa-chevron-up'></i>");
        creditState = 1;
      } else {
        $button.removeClass("bottom");
        $button.addClass("floating");
        $("#credit-jump").html("<i class='fas fa-chevron-down'></i>");
        creditState = 0;
      }
    },
    offset: "100%"
  });

});

// SCROLL TOP ON WINDOW RELOAD
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

// FIX FOR BUG
// where console initially appears at top on window reload

setTimeout(function(){
  $("#console").css("z-index", 5);
}, 2000);

// ANCHOR SCROLL

function scrollToAnchor(x){
  let aTag = $("a[name='"+ x +"']");
  $('html,body').animate({scrollTop: aTag.offset().top},'slow');
}

$("#map-jump").click(function() {
  scrollToAnchor('endmap');
});

let creditState = 0;

$("#credit-jump").click(function() {

  if (creditState == 0) {
    scrollToAnchor('endmap');
    $("#credit-jump").html("<i class='fas fa-chevron-up'></i>");
    creditState = 1;
  } else {
    scrollToAnchor('explore');
    $("#credit-jump").html("<i class='fas fa-chevron-down'></i>");
    creditState = 0;
  }
  
});

// SHARE MENU

let shareState = 0;

$("#share-menu").click(function() {

  let subs = ["twitter", "facebook", "linkedin"];

  if (shareState == 0) {

    let subReverse = subs.reverse();

    for (var i=0; i<subReverse.length; i++) {
      let x = subReverse[i];
      console.log(x);
      setTimeout(function(){
        $("#" + x).css("visibility", "visible").animate({opacity: 0.4}, 400);
        $("#" + x).hover(function() { 
          $(this).css("opacity", 1); 
        }, function() { 
            $(this).css("opacity", 0.4); 
        });
      }, (50*(i + 1)));
    }

    shareState = 1;

  } else {

    for (var i=0; i<subs.length; i++) {
      let x = subs[i];
      console.log(x);
      setTimeout(function(){
        $("#" + x).css("visibility", "hidden").animate({opacity: 0}, 400);
      }, (50*(i + 1)));
    }

    shareState = 0;

  }

});