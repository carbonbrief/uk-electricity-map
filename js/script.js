const $text= $('.text');
const $padding = $('.padding');
const $map = $('#map');

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

});

