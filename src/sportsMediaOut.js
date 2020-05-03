const editJsonFile = require("edit-json-file");
const electron = require('electron')
const ipcRenderer = electron.ipcRenderer;
let config = editJsonFile(`${__dirname}/assets/data/sports.json`);



$(document).ready(function() {

});
//All IPCs
ipcRenderer.on('addPoint', function(event, data) {
    var current = Number(document.getElementById(data.team).innerHTML);
    document.getElementById(data.team).innerHTML = current + Number(data.points);
});

ipcRenderer.on('delPoint', function(event, data) {
    console.log("Del")
    var current = Number(document.getElementById(data.team).innerHTML);
    document.getElementById(data.team).innerHTML = current - Number(data.points);
});

//End IPCs
//Sleep Function
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}
