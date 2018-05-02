// inspired by http://jsfiddle.net/simonsarris/Msdkv/ and http://jsfiddle.net/AbdiasSoftware/YVEhE/8/

var canvas = document.getElementById('canvas-id');
var ctx = canvas.getContext('2d');
var canvasWidth = 100;
var canvasHeight = 100;
var loading = true;

ctx.translate(10,10); // to move circle from canvas edges

ctx.save();

function rotate () {

    // Clear the canvas
    ctx.restore();

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
    // Move registration point to the center of the canvas
    ctx.translate(canvasWidth/2, canvasWidth/2);
        
    // Rotate 2 degrees
    ctx.rotate(Math.PI / 90);
        
    // Move registration point back to the top left corner of canvas
    ctx.translate(-canvasWidth/2, -canvasWidth/2);

    var firstPart = ctx.createLinearGradient(0,0,0,100);
    firstPart.addColorStop(0, '#f3f3f3');
    firstPart.addColorStop(0.2, '#cc9b7a');
    firstPart.addColorStop(0.4, '#ffc83e');
    firstPart.addColorStop(0.6, '#ff8767');
    firstPart.addColorStop(0.8, '#ea545c');
    firstPart.addColorStop(1, '#dd54b6');

    var secondPart = ctx.createLinearGradient(0,0,0,100);
    secondPart.addColorStop(1, '#dd54b6');
    secondPart.addColorStop(0.8, '#a45edb');
    secondPart.addColorStop(0.6, '#4e80e5');
    secondPart.addColorStop(0.4, '#43cfef');
    secondPart.addColorStop(0.2, '#00a98e');
    secondPart.addColorStop(0, '#A7B734');


    var width = 7;
    ctx.lineWidth = width;

    // First we make a clipping region for the left half
    ctx.save();
    ctx.beginPath();
    ctx.rect(-width, -width, 50+width, 100 + width*2);
    ctx.clip();

    // Then we draw the left half
    ctx.strokeStyle = firstPart;
    ctx.beginPath();
    ctx.arc(50,50,50,0,Math.PI*2, false);
    ctx.stroke();

    ctx.restore(); // restore clipping region to default

    // Then we make a clipping region for the right half
    ctx.save();
    ctx.beginPath();
    ctx.rect(50, -width, 50+width, 100 + width*2);
    ctx.clip();

    // Then we draw the right half
    ctx.strokeStyle = secondPart;
    ctx.beginPath();
    ctx.arc(50,50,50,0,Math.PI*2, false);
    ctx.stroke();

    ctx.restore(); // restore clipping region to default

}

if (loading = true) {
    setInterval(rotate, 20);
} else {
    // do nothing
}

// removing loading mask after a short interval
// timed to synchronise with the autoplay of the slider

setTimeout (function() {
    $('#loading').css('display', 'none');
    loading = false;
}, 1500);