const $text= $('.text');
const $padding = $('.padding');
const $map = $('#map');
const $year = $('.year');

let $height = $(window).height();
let $width = $(window).width();

function setHeights () {

  // get new height and width in case different
  $height = $(window).height();
  $width = $(window).width();

  $map.css("height", $height);

  if ($width > 979) {
    $padding.css("height", $height*0.7);
  } else {
    // further apart since now covering the map
    $padding.css("height", $height*0.9);
  }

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
            console.log("up");
            $year.removeClass("active");
            $(this.element).addClass("active");
          }
      },
      offset: 45
    });

    // travelling down
    new Waypoint({
      element: _this,
      handler: function (direction) {
          if (direction == 'down') {
            console.log("down");
            $year.removeClass("active");
            $(this.element).addClass("active");
          }
      },
      offset: 45
      // offset: function() {
      //   return (this.element.clientHeight + 40)
      // }
    });

  });

  // different code for the first year to avoid the jump bug
  new Waypoint({
    element: $(".year-first"),
    handler: function (direction) {
        if (direction == 'down') {
          console.log("first down");
          $year.removeClass("active");
          $(this.element).addClass("active");
        }
    },
    offset: function() {
      return 40
    }
  });

  //different code for the first year to avoid the jump
  new Waypoint({
    element: $(".year-first"),
    handler: function (direction) {
        if (direction == 'up') {
          console.log("first up");
          $year.removeClass("active");
          $(this.element).removeClass("active");
        }
    },
    offset: function() {
      return 40
    }
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

