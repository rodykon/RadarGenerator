var measures = [];

function removeFromList(id) {
    var item = document.getElementById(id);
    measures.splice(Number(id), 1);
    document.getElementById("list").removeChild(item);
    
    for (var i=Number(id)+1; i < measures.length+1; i++) {
        document.getElementById(String(i)).getElementsByTagName("input").item(0).setAttribute("onclick", "removeFromList('" + String(i-1) + "')");
        document.getElementById(String(i)).setAttribute("id", String(i-1));
    }
}

// Handle adding to list.
document.getElementById("add").onclick = function () {
    // Get the text box value.
    var value = document.getElementById("text_box").value;
    // Add value to measures array.
    measures.push(value);
    // Add value to list.
    var id = measures.length-1;
    var textNode = document.createElement("Li");
    textNode.appendChild(document.createTextNode(value));
    textNode.setAttribute("id", id);
    
    // Add 'remove' button
    var inputNode = document.createElement("input");
    inputNode.setAttribute("type", "button")
    inputNode.setAttribute("value", "remove");
    inputNode.setAttribute("onclick", "removeFromList('" + id + "')");
    textNode.appendChild(inputNode);
    document.getElementById("list").appendChild(textNode);
    
    // Delete current value and focus
    document.getElementById("text_box").value = "";
    document.getElementById("text_box").focus();
};


// Make enter add items to list.
document.getElementById("text_box").onkeyup = function (event) {
    
    event.preventDefault();
    
    if (event.keyCode === 13) {
        document.getElementById("add").click();
    }
};

// RADAR PARAMS
var referenceLines = 5;
var lineColor = "#A9A9A9";
var lineWidth = 2;
var textColor = "#000000";
var fontSize = 20;
var textDistance = 50;
var offset = true;

function updateParams() {
    referenceLines = document.getElementById("reference_lines").value;
    lineColor = document.getElementById("line_color").value;
    lineWidth = document.getElementById("line_width").value;
    textColor = document.getElementById("text_color").value;
    fontSize = document.getElementById("font_size").value;
    textDistance = document.getElementById("text_distance").value;
    offset = document.getElementById("offset").checked;
}
// Draw radar chart background on canvas.
document.getElementById("generate").onclick = function () {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    
    updateParams();
    
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    
    ctx.fillStyle = textColor;
    ctx.font = fontSize + "px Arial";
    ctx.textAlign = "center";
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    
    if (measures.length < 2) { // There needs to be more than one measure.
        alert("Number of measures must be greater than 1!");
    } else {
        var delta = 2*Math.PI / measures.length; // The angle difference between adjacent lines.
        var angleOffset = offset ? delta / 2 : 0;
        var lineLength = (canvas.getAttribute("width") / 8) * 3;
        var currentAngle = 0;
        
        for (var i = 0; i < measures.length; i++) { // Draw main lines and text.
            var x = lineLength * Math.cos(angleOffset + currentAngle);
            var y = lineLength * Math.sin(angleOffset + currentAngle);
            
            // Draw line
            ctx.beginPath();
            ctx.moveTo(400, 400);
            ctx.lineTo(400 + x, 400 - y);
            ctx.stroke();
            
            var x = (lineLength + Number(textDistance)) * Math.cos(angleOffset + currentAngle);
            var y = (lineLength + Number(textDistance)) * Math.sin(angleOffset + currentAngle);
            
            // Draw text
            ctx.fillText(measures[i], 400 + x, 400 - y);
            
            currentAngle += delta;
        }
        
        // Draw inner lines.
        for (var i = 1; i <= referenceLines; i++) {
            var length = i*(lineLength / referenceLines);
            var currentAngle = 0;
            ctx.beginPath();
            ctx.moveTo(400 + length*Math.cos(angleOffset + currentAngle), 400 - length*Math.sin(angleOffset + currentAngle));
            for (var j = 0; j < measures.length; j++) {
                currentAngle+=delta;
                ctx.lineTo(400 + length*Math.cos(angleOffset + currentAngle), 400 - length*Math.sin(angleOffset + currentAngle))
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

document.getElementById("show_advanced").onclick = function () {
    button = document.getElementById("show_advanced");
    if (button.className == "active") { // Hide menu.
        button.className = "inactive";
        document.getElementById("advanced_options").setAttribute("hidden", "");
    } else { // Show menu.
        button.className = "active";
        document.getElementById("advanced_options").removeAttribute("hidden");
        
    }
    
};