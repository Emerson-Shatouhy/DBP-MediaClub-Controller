const editJsonFile = require("edit-json-file");
const electron = require('electron')
const ipcRenderer = electron.ipcRenderer;
const {desktopCapturer} = electron
const path = require('path')

let config = editJsonFile(`${__dirname}/assets/data/sports.json`);

//Opens Modal on Start
$(document).ready(function() {
    $('#mainModal').modal('show')
});

//Modal Control
function modalSubmit() {
    config.set("otherTeam", document.forms["myForm"]["vistingTeam"].value);
    var current = document.getElementById("opponent").innerHTML;
    document.getElementById("opponent").innerHTML = config.get("otherTeam") + " " + current;
    config.set("boscoScore", 0);
    config.set("otherScore", 0);

    $('#mainModal').modal('hide')
//Send Info, Make Output Window
    ipcRenderer.invoke('init', config.get("otherTeam"));
    sleep(2000);
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
}

//Output Control
const BrowserWindow = electron.remote.BrowserWindow
$(".btnSeccion").click(function(event) {
    btnMostrarSeccion($(this));
    event.preventDefault();
})

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


//Sleep Function
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}
