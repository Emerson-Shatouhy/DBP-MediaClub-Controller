const editJsonFile = require("edit-json-file");
const electron = require('electron')
const ipcRenderer = electron.ipcRenderer;
const {desktopCapturer} = electron
const path = require('path')
var reader = new FileReader();
const fs = require('fs');

let config = editJsonFile(`${__dirname}/assets/data/sports.json`);
let startTime = "0";
let otherColor = "";
//Opens Modal on Start
$(document).ready(function() {
    $('#mainModal').modal('show')

});

//Modal Control
function modalSubmit() {
    config.set("otherTeam", document.forms["modalForm"]["vistingTeam"].value);
    otherColor = (document.forms["modalForm"]["otherColor"].value);
    var current = document.getElementById("opponent").innerHTML;
    document.getElementById("opponent").innerHTML = config.get("otherTeam") + " " + current;
    config.set("boscoScore", 0);
    config.set("otherScore", 0);
    if(document.forms["modalForm"]["sportControl"].value == "Football"){
      document.getElementById("clockSet").value = "15:00";
      startTime = "15:00";
    }
    else if(document.forms["modalForm"]["sportControl"].value == "Soccer"){
      document.getElementById("clockSet").value = "15:00";
      startTime = "15:00";
    }
    else if(document.forms["modalForm"]["sportControl"].value == "Soccer"){
      document.getElementById("clockSet").value = "12:00";
      startTime = "12:00";
    }
    $('#mainModal').modal('hide')
    ipcRenderer.invoke('start');
    sleep(1000);
    desktopCapturer.getSources({
        types: ['window', 'screen']
    }).then(async sources => {
        for (const source of sources) {
            if (source.name === 'MediaOut') {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: false,
                        video: {
                            mandatory: {
                                chromeMediaSource: 'desktop',
                                chromeMediaSourceId: source.id,
                                minWidth: 1280,
                                maxWidth: 1280,
                                minHeight: 720,
                                maxHeight: 720
                            }
                        }
                    })
                    handleStream(stream)
                } catch (e) {
                    handleError(e)
                }
                return
            }
        }
    })

    function handleStream(stream) {
        const video = document.getElementById('output');
        video.srcObject = stream
        video.onloadedmetadata = (e) => video.play()
    }

    function handleError(e) {
        console.log(e)
    }
    ipcRenderer.invoke('init', config.get("otherTeam"), startTime, otherColor);
}

//Output Control
const BrowserWindow = electron.remote.BrowserWindow
$(".btnSeccion").click(function(event) {
    btnMostrarSeccion($(this));
    event.preventDefault();
})

//Clock Control
function clock(arg){
  if(arg == "start"){
    document.getElementById("clockSet").setAttribute('disabled','true');
    ipcRenderer.invoke('clock', 'start');
  }
  if(arg == "stop"){
    ipcRenderer.invoke('clock', 'stop');
    document.getElementById("clockSet").removeAttribute('disabled');
  }
  if(arg == "set"){
    ipcRenderer.invoke('clock', 'set', document.getElementById("clockSet").value);
  }
}

//Clock Done Alert
ipcRenderer.on('clockDone', function(event) {
  document.getElementById("clockSet").removeAttribute('disabled');
});

//Current Time
ipcRenderer.on('currentTime', function(event, data) {
var newTime = data.min + ":" + data.sec;
document.getElementById("clockSet").value = newTime.toString();
});

//Set Quarter
function quarter(){
ipcRenderer.invoke('setQuarter', document.getElementById("quarterSet").value);
}

function points(team, points, action){
  var teamID = team + "Score";
  currentScore = Number(document.getElementById(teamID).innerHTML);
  switch(action){
    case "+":
    console.log("+")
      var newScore = document.getElementById(teamID).innerHTML = currentScore + Number(points);
      ipcRenderer.invoke('point', teamID, newScore);
      break;
    case "-":
    var newScore = document.getElementById(teamID).innerHTML = currentScore - Number(points);
    ipcRenderer.invoke('point', teamID, newScore);
    break;
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
