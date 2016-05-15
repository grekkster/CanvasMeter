window.onload = canvasApp;

//TODO refaktorizovat, tridy, objekty (knihovna pomocnych graf. fci, merak,...)
function canvasApp() {
    // assign canvas to a variable
    var canvas = document.getElementById("canvas");
    // create html5 context object to enable draw methods
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
    }

    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    var requestAnimationFrame =
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            function (callback) {
                return window.setTimeout(callback, 1000 / 60);
            };

//    var aNewNumber = 10;
//    var fps = 1;

    var colWidth = 10;
    var numCols = Math.floor(canvasWidth / colWidth);
    var rest = Math.floor((canvasWidth % colWidth) / 2);

    // initialization of columnt dif values
    var newColHeight = [];
    var oldColHeight = [];
    for (var i = 0; i < numCols; i++) {
        newColHeight[i] = 0;
        oldColHeight[i] = 0;
    }

    var milisecondoffset = 2000;
    var elapsedMiliseconds = milisecondoffset;
    var oldTime = 0;
    var frameCount = 0;
    var render = function () {
//        // render every second
//        setTimeout(function () {
//            requestAnimationFrame(render);
//            ctx.clearRect(0, 0, canvas.width, canvas.height);
//            ctx.fillText("Next number is: " + aNewNumber++, 50, 50);
//        }, 1000 / fps);

        frameCount++;
        var d = new Date();
        var t = d.getTime();
        var n = d.getMilliseconds();
        var now = Date.now();

        elapsedMiliseconds = Date.now() - oldTime;
        
        ctx.clearRect(0, 0, canvasWidth, canvasHeight); // clear canvas
        ctx.fillStyle = "black";
        var fps = Math.round((frameCount / elapsedMiliseconds) * 1000);
        ctx.font = "16px Arial";
        ctx.fillText("FPS: " + fps, 5, 17);

        // every completed cycle
        if (elapsedMiliseconds >= milisecondoffset) {
            oldTime = Date.now();
            elapsedMiliseconds = 0;
            frameCount = 0;

            for (var i = 0; i < numCols; i++) {
                var height = Math.floor((Math.random() * 1000) % canvasHeight);
                oldColHeight[i] = newColHeight[i];
                newColHeight[i] = height;
            }
        }

        // render whenever possible
        drawFullCols(ctx);
        requestAnimationFrame(render);
    }

    function drawFullCols() {
//        var colWidth = 10;
//        var numCols = Math.floor(canvasWidth / colWidth);
//        var rest = Math.floor((canvasWidth % colWidth) / 2);

//        for (var i = 0; i < numCols; i++) {
//            var x = rest + i * colWidth + 1;
//            var width = colWidth - 2;
//            var height = Math.floor((Math.random() * 1000) % canvasHeight);
////        var height = (canvas.height / numCols) * i;
//            // linear increase
//            var y = canvasHeight - height;
//            newColHeight[i] = height;
//            drawRect(x, y, width, height, heatMapColorforValue(height / canvasHeight));

        for (var i = 0; i < numCols; i++) {
            var x = rest + i * colWidth + 1;
            var width = colWidth - 2;
            var height = oldColHeight[i] +
                    ((newColHeight[i] - oldColHeight[i]) *
                            (elapsedMiliseconds / milisecondoffset));
//            newColHeight[i] = height;
            var y = canvasHeight - height;
            drawRect(x, y, width, height, heatMapColorforValue(height / canvasHeight));
        }
    }

    function drawRect(x, y, w, h, color) {
        //ctx.fillStyle = "#EEEEEE";
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    }

    function getRandomColor() {
        return '#' + Math.floor(Math.random() * 0xFFFFFF << 0).toString(16);
    }

    function getHeatColor(percentage) {
        return '#' + Math.floor(percentage * 0xFFFFFF << 0).toString(16);
    }

    function getHeatColorByColHeight(height) {
        var percentage = height / canvasHeight;
        return getHeatColor(percentage);
    }

    function heatMapColorforValue(value) {
        var h = (1.0 - value) * 240;
        return "hsl(" + h + ", 100%, 50%)";
    }

    render();
}