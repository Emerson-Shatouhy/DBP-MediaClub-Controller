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







function addPoints(team) {
  if (team == "bosco") {
    switch(document.getElementById) {
      case "addOne":
        document.getElementById("boscoScore").innerHTML = config.get("boscoScore") + 1;
        ipcRenderer.invoke('addPoint', '1', "Bosco");
        config.set("boscoScore", config.get("boscoScore") + 1);
        config.save();
        break;
      case "addTwo":
        document.getElementById("boscoScore").innerHTML = config.get("boscoScore") + 2;
        ipcRenderer.invoke('addPoint', '2', "Bosco");
        config.set("boscoScore", config.get("boscoScore") + 2);
        config.save();
        break;
      case "addThree":
        document.getElementById("boscoScore").innerHTML = config.get("boscoScore") + 3;
        ipcRenderer.invoke('addPoint', '3', "Bosco");
        config.set("boscoScore", config.get("boscoScore") + 3);
        config.save();
        break;
      default:
        null;
      
  else if(team == "other") {
    switch(document.getElementById) {
      case "addOne":
        document.getElementById("otherScore").innerHTML = config.get("otherScore") + 1;
        ipcRenderer.invoke('addPoint', '1', "Other");
        config.set("otherScore", config.get("otherScore") + 1);
        config.save();
        break;
      case "addTwo":
        document.getElementById("otherScore").innerHTML = config.get("otherScore") + 2;
        ipcRenderer.invoke('addPoint', '2', "Other");
        config.set("otherScore", config.get("otherScore") + 2);
        config.save();
        break;
      case "addThree":
        document.getElementById("otherScore").innerHTML = config.get("otherScore") + 3;
        ipcRenderer.invoke('addPoint', '3', "Other");
        config.set("otherScore", config.get("otherScore") + 3);
        config.save();
        break;
      default:
        null;
    }
  }

    }
  }
  } //pls fix these brackets idk which belongs to which
}

function removePoints {
  if (team == "bosco") {
    switch(document.getElementById) {
      case "removeOne"":
        document.getElementById("boscoScore").innerHTML = config.get("boscoScore") - 1;
        ipcRenderer.invoke('delPoint', '1', "Bosco");
        config.set("boscoScore", config.get("boscoScore") - 1);
        config.save();
        break;
      case "removeTwo":
        document.getElementById("boscoScore").innerHTML = config.get("boscoScore") - 2;
        ipcRenderer.invoke('delPoint', '2', "Bosco");
        config.set("boscoScore", config.get("boscoScore") - 2);
        config.save();
        break;
      case "removeThree":
        document.getElementById("boscoScore").innerHTML = config.get("boscoScore") - 3;
        ipcRenderer.invoke('delPoint', '3', "Bosco");
        config.set("boscoScore", config.get("boscoScore") - 3);
        config.save();
        break;
      default:
        null;
      
  else if(team == "other") {
    switch(document.getElementById) {
      case "removeOne":
        document.getElementById("otherScore").innerHTML = config.get("otherScore") - 1;
        ipcRenderer.invoke('delPoint', '1', "Other");
        config.set("otherScore", config.get("otherScore") - 1);
        config.save();
        break;
      case "removeTwo":
        document.getElementById("otherScore").innerHTML = config.get("otherScore") - 2;
        ipcRenderer.invoke('delPoint', '2', "Other");
        config.set("otherScore", config.get("otherScore") - 2);
        config.save();
        break;
      case "removeThree":
        document.getElementById("otherScore").innerHTML = config.get("otherScore") - 3;
        ipcRenderer.invoke('delPoint', '3', "Other");
        config.set("otherScore", config.get("otherScore") - 3);
        config.save()
        break;
      default:
        null;
    }
}


/*
 Old Points Functions


//Add Points
function addOne(team) {
    if (team == "bosco") {
        document.getElementById("boscoScore").innerHTML = config.get("boscoScore") + 1;
        ipcRenderer.invoke('addPoint', '1', "Bosco");
        config.set("boscoScore", config.get("boscoScore") + 1);
        config.save();
    } else if (team == "other") {
        document.getElementById("otherScore").innerHTML = config.get("otherScore") + 1;
        ipcRenderer.invoke('addPoint', '1', "Other");
        config.set("otherScore", config.get("otherScore") + 1);
        config.save();
    }
}

//Add 2 Points
function addTwo(team) {
    if (team == "bosco") {
        document.getElementById("boscoScore").innerHTML = config.get("boscoScore") + 2;
        ipcRenderer.invoke('addPoint', '2', "Bosco");
        config.set("boscoScore", config.get("boscoScore") + 2);
        config.save();
    } else if (team == "other") {
        document.getElementById("otherScore").innerHTML = config.get("otherScore") + 2;
        ipcRenderer.invoke('addPoint', '2', "Other");
        config.set("otherScore", config.get("otherScore") + 2);
        config.save();
    }
}

//Add 3 Points
function addThree(team) {
    if (team == "bosco") {
        document.getElementById("boscoScore").innerHTML = config.get("boscoScore") + 3;
        ipcRenderer.invoke('addPoint', '3', "Bosco");
        config.set("boscoScore", config.get("boscoScore") + 3);
        config.save();
    } else if (team == "other") {
        document.getElementById("otherScore").innerHTML = config.get("otherScore") + 3;
        ipcRenderer.invoke('addPoint', '3', "Other");
        config.set("otherScore", config.get("otherScore") + 3);
        config.save();
    }
}

//Remove Points
function removeOne(team) {
    if (team == "bosco") {
        document.getElementById("boscoScore").innerHTML = config.get("boscoScore") - 1;
        ipcRenderer.invoke('delPoint', '1', "Bosco");
        config.set("boscoScore", config.get("boscoScore") - 1);
        config.save();
    } else if (team == "other") {
        document.getElementById("otherScore").innerHTML = config.get("otherScore") - 1;
        ipcRenderer.invoke('delPoint', '1', "Other");
        config.set("otherScore", config.get("otherScore") - 1);
        config.save();
    }
}

function removeTwo(team) {
    if (team == "bosco") {
        document.getElementById("boscoScore").innerHTML = config.get("boscoScore") - 2;
        ipcRenderer.invoke('delPoint', '2', "Bosco");
        config.set("boscoScore", config.get("boscoScore") - 2);
        config.save();
    } else if (team == "other") {
        document.getElementById("otherScore").innerHTML = config.get("otherScore") - 2;
        ipcRenderer.invoke('delPoint', '2', "Other");
        config.set("otherScore", config.get("otherScore") - 2);
        config.save();
    }
}

function removeThree(team) {
    if (team == "bosco") {
        document.getElementById("boscoScore").innerHTML = config.get("boscoScore") - 3;
        ipcRenderer.invoke('delPoint', '3', "Bosco");
        config.set("boscoScore", config.get("boscoScore") - 3);
        config.save();
    } else if (team == "other") {
        document.getElementById("otherScore").innerHTML = config.get("otherScore") - 3;
        ipcRenderer.invoke('delPoint', '3', "Other");
        config.set("otherScore", config.get("otherScore") - 3);

    }
}

*/



















//File Reader
//Sleep Function
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}
