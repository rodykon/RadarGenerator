var measures = [];

// Handle adding to list.
document.getElementById("add").onclick = function () {
    "use strict";
    // Get the text box value.
    var value = document.getElementById("text_box").value;
    // Add value to measures array.
    measures.push(value);
    // Add value to list.
    var node = document.createElement("Li");
    node.appendChild(document.createTextNode(value));
    document.getElementById("list").appendChild(node);
    
    // Delete current value and focus
    document.getElementById("text_box").value = "";
    document.getElementById("text_box").focus();
};

// Make enter add items to list.
document.getElementById("text_box").onkeyup = function (event) {
    "use strict";
    
    event.preventDefault();
    
    if (event.keyCode === 13) {
        document.getElementById("add").click();
    }
};

// RADAR PARAMS
var referenceLines = 5;
var chartColor = "#A9A9A9";
var textColor = "#000000";

// Draw radar chart background on canvas.
document.getElementById("generate").onclick = function () {
    "use strict";
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    
    if (measures.length < 2) { // There needs to be more than one measure.
        alert("Number of measures must be greater than 1!");
    } else {
        var delta = 2*Math.PI / measures.length; // The angle difference between adjacent lines.
        var angleOffset = delta / 2;
        var lineLength = (canvas.getAttribute("width") / 8) * 3;
        var currentAngle = 0;
        
        ctx.fillStyle = "gray";
        for (var i = 0; i < measures.length; i++) { // Draw main lines and text.
            var x = lineLength * Math.cos(angleOffset + currentAngle);
            var y = lineLength * Math.sin(angleOffset + currentAngle);
            
            // Draw line
            ctx.strokeStyle = chartColor; // Set color to LightGray
            ctx.beginPath();
            ctx.moveTo(400, 400);
            ctx.lineTo(400 + x, 400 + y);
            ctx.stroke();
            
            var x = (lineLength + 50) * Math.cos(angleOffset + currentAngle);
            var y = (lineLength + 50) * Math.sin(angleOffset + currentAngle);
            
            // Draw text
            ctx.fillStyle = textColor; // Set color to black
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText(measures[i], 400 + x, 400 + y);
            
            currentAngle += delta;
        }
        
        ctx.strokeStyle = chartColor; // Set color to LightGray
        // Draw inner lines.
        for (var i = 1; i <= referenceLines; i++) {
            var length = i*(lineLength / referenceLines);
            var currentAngle = 0;
            ctx.beginPath();
            ctx.moveTo(400 + length*Math.cos(angleOffset + currentAngle), 400 + length*Math.sin(angleOffset + currentAngle));
            for (var j = 0; j < measures.length; j++) {
                currentAngle+=delta;
                ctx.lineTo(400 + length*Math.cos(angleOffset + currentAngle), 400 + length*Math.sin(angleOffset + currentAngle))
            }
            ctx.stroke();
        }
    }
};

// Download canvas as png.
document.getElementById("export").onclick = function () {
    var canvas = document.getElementById("canvas");
    var image = canvas.toDataURL("image/png"); //Convert image to 'octet-stream' (Just a download, really)
    
    var link = document.createElement('a');
    link.download = "radar.png";
    link.href = image;
    link.dataset.downloadurl = ["image/png", link.download, link.href].join(":");
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};