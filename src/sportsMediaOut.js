const electron = require('electron')
const ipcRenderer = electron.ipcRenderer;
var clock;
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const boscoPoints = canvas.getContext("2d")
const otherPoints = canvas.getContext("2d")
const time = canvas.getContext("2d")
const yardsTG = canvas.getContext("2d")
const down = canvas.getContext("2d")
var currentMin;
var currentSec;

$(document).ready(function() {

});
//All IPCs
//Initialization of Scoreboard
ipcRenderer.on('init', function(event, data) {
  const img = new Image()
img.onload = function(){
  ctx.drawImage(img, 10, 10);
  ctx.font = "Bold 50pt Century Gothic";
  ctx.fillStyle = "black";
  boscoPoints.fillText("0", 225, 240);
  otherPoints.fillText("0", 470, 240);
  ctx.font = "Bold 15pt Century Gothic"
  ctx.fillStyle = "grey"
  ctx.fillText("1st & 10", 480, 278);
  ctx.font = "Bold 15pt Century Gothic"
  ctx.fillText("Q1", 350, 262);
  time.font = "Bold 32pt Century Gothic"
  time.fillText(data.startTime, 305, 233)
  let split = data.startTime.indexOf(':')
     currentMin = data.startTime.substring(0, split);
     currentSec = data.startTime.substring(split + 1, data.startTime.length);

    
};
img.src = "./assets/images/scoreboardFinal.png"
  //document.getElementById("Clock").innerHTML = data.startTime;
 // document.getElementById("otherTeam").innerHTML = data.otherName;
  //document.getElementById("otherTeam").style.background = data.otherColor;
  //document.getElementById("Quarter").innerHTML = "Q1";
});

//Add Point
ipcRenderer.on('point', function(event, data) {
  if(data.team == "boscoScore"){
    if(data.points < 10){
      ctx.font = "Bold 50pt Century Gothic";
      ctx.fillStyle = "#BBBBBB";
      ctx.fillRect(200, 190, 100, 70)
      ctx.fillStyle = '#000000'; // or whatever color the background is.
      ctx.fillText(data.points, 225, 240);
    } else {
      ctx.font = "Bold 50pt Century Gothic";
      ctx.fillStyle = "#BBBBBB";
      ctx.fillRect(200, 190, 100, 70)
      ctx.fillStyle = '#000000'; // or whatever color the background is.
      ctx.fillText(data.points, 215, 240);
    }
  } else {
    if(data.points < 10){
      ctx.font = "Bold 50pt Century Gothic";
      ctx.fillStyle = "#BBBBBB";
      ctx.fillRect(443, 190, 100, 70)
      ctx.fillStyle = '#000000'; 
      ctx.fillText(data.points, 470, 240);
    } else {
      ctx.font = "Bold 50pt Century Gothic";
      ctx.fillStyle = "#BBBBBB";
      ctx.fillRect(443, 190, 100, 70)
      ctx.fillStyle = '#000000'; 
      ctx.fillText(data.points, 455, 240);
    }
  }
  document.getElementById(data.team).innerHTML = Number(data.points);
});


//Set Quarter
ipcRenderer.on('setQuarter', function(event, data) {
  ctx.font = "Bold 15pt Century Gothic"
  ctx.fillStyle = "#6A0832";
  ctx.fillRect(350, 245, 30, 20)
  ctx.fillStyle = "grey"
  ctx.fillText(data.quarter, 350, 262);

  document.getElementById("Quarter").innerHTML = data.quarter;
});

//Clock Controls
ipcRenderer.on('clock', function(event, data) {
  if (data.action == 'start') {
    if (!clock) {
      clockStart();
    }
  }
  if (data.action == 'stop') {
    if (clock) {
      clearInterval(clock);
      clock = null;
    }
  }
  if (data.action == 'set') {
    let split = data.newTime.indexOf(':')
    let min = data.newTime.substring(0, split);
    let sec = data.newTime.substring(split + 1, data.newTime.length);
     currentMin = data.newTime.substring(0, split);
     currentSec = data.newTime.substring(split + 1, data.newTime.length);
    if (min.length == 1){
      time.font = "Bold 32pt Century Gothic"
      ctx.fillStyle = "#6A0832";
      ctx.fillRect(310, 185, 110, 60)
      ctx.fillStyle = "grey" 
      ctx.fillText("0" + data.newTime, 305, 233);
    }else{
      time.font = "Bold 32pt Century Gothic"
      ctx.fillStyle = "#6A0832";
      ctx.fillRect(310, 185, 110, 60)
      ctx.fillStyle = "grey"
      ctx.fillText(data.newTime, 305, 233);
  }
  }

});
// Set Down
ipcRenderer.on('setDown', function(event, data) {
  ctx.font = "Bold 32pt Century Gothic"
  ctx.fillStyle = "#6A0832";
  ctx.fillRect(480, 263, 80, 16)
  ctx.fillStyle = "grey"; 
  ctx.font = "Bold 15pt Century Gothic"

  ctx.fillText(data.down, 480, 278);
});

//Set YTG
ipcRenderer.on('setYTG', function(event, data) {
  document.getElementById("YTG").innerHTML = data.ytg;
});

//Functions Start

//Clock Controller
function clockSet() {
  if (Number(currentSec) == 00) {
    currentMin = currentMin - 1;
    currentSec = 59;
  } else {
    currentSec = currentSec - 1;
  }
  if (Number(currentSec) < 10) {
    currentSec = "0" + currentSec;
  }
  if (Number(currentMin) < 10 && currentMin.length < 2) {
    currentMin = "0" + currentMin;
  }
  if (Number(currentMin) <= 0 && Number(currentSec) <= 0) {
    clearInterval(clock);
    clock = null;
    ipcRenderer.invoke('clockDone');
    time.font = "Bold 32pt Century Gothic"
    ctx.fillStyle = "#6A0832";
    ctx.fillRect(308, 185, 110, 60)
    ctx.fillStyle = "grey"
    ctx.fillText("00:00", 305, 233);
    ipcRenderer.invoke('currentTime', currentMin, currentSec);
  } else {
    time.font = "Bold 32pt Century Gothic"
    ctx.fillStyle = "#6A0832";
    ctx.fillRect(308, 185, 110, 60)
    ctx.fillStyle = "grey"
    if(currentMin > 10 && currentMin.length < 2){
      ctx.fillText( "0" + currentMin + ":" + currentSec, 312, 233);
    } else {
    ctx.fillText( currentMin + ":" + currentSec, 305, 233);
    }
    ipcRenderer.invoke('currentTime', currentMin, currentSec);
  }
}

//Clock Starter
function clockStart() {
  if (!clock) {
    var func = clockSet;
    clock = setInterval(func, 1000);
  }
}

//Sleep Function
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}
