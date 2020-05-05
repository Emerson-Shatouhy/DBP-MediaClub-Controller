const editJsonFile = require("edit-json-file");
const electron = require('electron')
const ipcRenderer = electron.ipcRenderer;
let config = editJsonFile(`${__dirname}/assets/data/sports.json`);
var clock;



$(document).ready(function() {

});
//All IPCs

//Initialization of Scoreboard
ipcRenderer.on('init', function(event, data){
  document.getElementById("Clock").innerHTML = data.startTime;
  document.getElementById("otherTeam").innerHTML = data.otherName;
   document.getElementById("otherTeam").style.background = data.otherColor;
   document.getElementById("Quarter").innerHTML = "Q1";
});

//Add Point
ipcRenderer.on('addPoint', function(event, data) {
    var current = Number(document.getElementById(data.team).innerHTML);
    document.getElementById(data.team).innerHTML = current + Number(data.points);
});

//Del Point
ipcRenderer.on('delPoint', function(event, data) {
    var current = Number(document.getElementById(data.team).innerHTML);
    document.getElementById(data.team).innerHTML = current - Number(data.points);
});

//Set Quarter
ipcRenderer.on('setQuarter', function(event, data) {
  document.getElementById("Quarter").innerHTML = data.quarter;
});

//Clock Controls
ipcRenderer.on('clock', function(event, data) {
    if(data.action == 'start'){
      if (!clock) {
      clockStart();
    }
    }
    if(data.action == 'stop'){
      if (clock) {
      clearInterval(clock);
      clock = null;
    }
    }
        if(data.action == 'set'){
          let split = data.newTime.indexOf(':')
          let min = data.newTime.substring(0,split);
          let sec = data.newTime.substring(split + 1,data.newTime.length);
          if(min.length == 1)
          document.getElementById("Clock").innerHTML = "0" + data.newTime;
          else
          document.getElementById("Clock").innerHTML = data.newTime;
        }

});

//Functions Start

//Clock Controller
function clockSet(){
  let current = document.getElementById("Clock").innerHTML;
  let split = current.indexOf(':')
  let currMin = current.substring(0,split);
  let currSec = current.substring(split + 1,current.length);
  if(Number(currSec) == 00) {
    currMin = currMin -1;
    currSec = 59;
  } else {
    currSec = currSec - 1;
  }
  if(Number(currSec) < 10){
    currSec = "0" + currSec;
  }
  if(Number(currMin) < 10 && currMin.length < 2){
    currMin = "0" + currMin;
  }
  if(Number(currMin) <= 0 && Number(currSec) <= 0)
  {
    clearInterval(clock);
    clock = null;
    ipcRenderer.invoke('clockDone');
    document.getElementById("Clock").innerHTML = "00:00";
    ipcRenderer.invoke('currentTime', currMin, currSec);
  } else {
  document.getElementById("Clock").innerHTML = currMin + ":" + currSec;
  ipcRenderer.invoke('currentTime', currMin, currSec);
}
}

//Clock Starter
function clockStart(){
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
