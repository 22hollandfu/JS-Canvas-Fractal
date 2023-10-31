const canvas = document.querySelector("#board");
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
canvas.addEventListener("mousedown", mouseDown);
let mouseX, mouseY;
ctx.fillStyle = "black";
ctx.fillRect(0,0, width, height);
ctx.translate(width / 2, height / 2);
let theta = Math.PI / 6;
let lenScalar = .5;
let len = height / 5; 
let treeLength = 13;
let hue = 0;
let sliderStartX = -width / 2 + 30;
let angleSliderX = sliderStartX + (theta * 180 / Math.PI);
let ratioSliderX = sliderStartX + (360 / 5 * lenScalar);
let lengthSliderX = sliderStartX + (360 / (height / 2) * len);
let depthSliderX = sliderStartX + (360 / 20 * treeLength);
let fractalAnimate;
ctx.strokeStyle = hueToColor(hue);
paint();
fractalAnimate = setInterval(function() {
    hue += 0.5;
    paint();
}, 10);

function paint() {
    ctx.fillStyle = "black";
    ctx.fillRect(-width / 2, -height / 2 , width, height);
    ctx.beginPath();
    ctx.moveTo(0, -len);
    ctx.lineTo(0, len);
    ctx.stroke();
    drawSlider("Angle (degrees)", Math.round(theta * 180 / Math.PI), 360, sliderStartX, -height / 2 + 30, angleSliderX);
    drawSlider("Recursive Length Ratio", lenScalar, 5, sliderStartX, -height / 2 + 80, ratioSliderX);
    drawSlider("Base Length (px)", len, height / 2, sliderStartX, -height / 2 + 130, lengthSliderX);
    drawSlider("Tree Depth", treeLength, 20, sliderStartX, -height / 2 + 180, depthSliderX);
    drawFractal(0, len, Math.PI / 2 + theta, 1, hueToColor(hue + 360 / treeLength));
    drawFractal(0, len, Math.PI / 2 - theta, 1, hueToColor(hue + 360 / treeLength));
}

function drawFractal(x, y, t, depth, color) {
    if(2 * depth == treeLength)
        return;
    let newX = x + Math.pow(lenScalar, Math.floor(depth)) * len * Math.cos(t);
    let newY = y + Math.pow(lenScalar, Math.floor(depth)) * len * Math.sin(t);
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(newX , newY);
    ctx.moveTo(-x, -y);
    ctx.lineTo(-newX , -newY);
    ctx.stroke();
    drawFractal(newX,  newY, t + theta, depth + 0.5, hueToColor(hue + 360 / treeLength * (depth + 1)));
    drawFractal(newX,  newY, t - theta, depth + 0.5, hueToColor(hue + 360 / treeLength * (depth + 1)));
}

function hueToColor(degrees) {
    let deg = degrees % 360;
    var degToCase = Math.floor(deg / 60);
    switch(degToCase) {
        case 0:
            return "rgb(255, " + (4.25 * (deg - degToCase * 60)).toString() + " , 0)";
        case 1:
            return "rgb(" + (255 - 4.25 * (deg - degToCase * 60)).toString() + " , 255, 0)";
        case 2:
            return "rgb(0, 255, " + (4.25 * (deg - degToCase * 60)).toString() + ")";
        case 3:
            return "rgb(0, " + (255 - 4.25 * (deg - degToCase * 60)).toString() + " , 255)";
        case 4:
            return "rgb(" + (4.25 * (deg - degToCase * 60)).toString() + " , 0, 255)";
        case 5:
            return "rgb(255, 0, " + (255 - 4.25 * (deg - degToCase * 60)).toString() + ")";
    }
}

function mouseDown(e) {
    mouseX = e.clientX - width / 2;
    mouseY = e.clientY - height / 2;
    if(mouseX >= angleSliderX && mouseX <= angleSliderX + 10 && mouseY >= -height / 2 + 30 && mouseY <= -height / 2 + 50) {
        canvas.addEventListener("mousemove", angleSlider);
        canvas.addEventListener("mouseup", mouseUp);
    }
    if(mouseX >= ratioSliderX && mouseX <= ratioSliderX + 10 && mouseY >= -height / 2 + 80 && mouseY <= -height / 2 + 100) {
        canvas.addEventListener("mousemove", ratioSlider);
        canvas.addEventListener("mouseup", mouseUp);
    }
    if(mouseX >= lengthSliderX && mouseX <= lengthSliderX + 10 && mouseY >= -height / 2 + 130 && mouseY <= -height / 2 + 150) {
        canvas.addEventListener("mousemove", lengthSlider);
        canvas.addEventListener("mouseup", mouseUp);
    }
    if(mouseX >= depthSliderX && mouseX <= depthSliderX + 10 && mouseY >= -height / 2 + 180 && mouseY <= -height / 2 + 200) {
        canvas.addEventListener("mousemove", depthSlider);
        canvas.addEventListener("mouseup", mouseUp);
    }
}

function angleSlider(e) {
    angleSliderX = e.clientX - width / 2;
    if(angleSliderX > sliderStartX + 360)
        angleSliderX = sliderStartX + 360;
    if(angleSliderX < sliderStartX)
        angleSliderX = sliderStartX;
    theta = (angleSliderX - sliderStartX) * Math.PI / 180;
    paint();
}

function ratioSlider(e) {
    ratioSliderX = e.clientX - width / 2;
    if(ratioSliderX > sliderStartX + 360)
        ratioSliderX = sliderStartX + 360;
    if(ratioSliderX < sliderStartX)
        ratioSliderX = sliderStartX;
    lenScalar = Math.round((ratioSliderX - sliderStartX) * 0.014 * 100) / 100;
    paint();
}

function lengthSlider(e) {
    lengthSliderX = e.clientX - width / 2;
    if(lengthSliderX > sliderStartX + 360)
        lengthSliderX = sliderStartX + 360;
    if(lengthSliderX < sliderStartX)
        lengthSliderX = sliderStartX;
    len = (lengthSliderX - sliderStartX) * (height / 2 / 360);
    paint();
}

function depthSlider(e) {
    depthSliderX = e.clientX - width / 2;
    if(depthSliderX > sliderStartX + 360)
        depthSliderX = sliderStartX + 360;
    if(depthSliderX < sliderStartX)
        depthSliderX = sliderStartX;
    treeLength = Math.round((depthSliderX - sliderStartX) * 0.0555);
    paint();
}

function mouseUp() {
   canvas.removeEventListener("mouseup", mouseUp);
   canvas.removeEventListener("mousemove", angleSlider);
   canvas.removeEventListener("mousemove", ratioSlider);
   canvas.removeEventListener("mousemove", lengthSlider);
   canvas.removeEventListener("mousemove", depthSlider);
}

function drawSlider(label, value, max, x, y, buttonX) {
    ctx.fillStyle = "white";
    ctx.fillText(label + ": " + value, x, y);
    ctx.fillStyle = "gray";
    ctx.fillRect(x, y + 15, 360, 10);
    ctx.fillStyle = "red";
    ctx.fillRect(buttonX, y + 10, 10, 20);
}