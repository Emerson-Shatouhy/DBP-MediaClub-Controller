const electron = require('electron')
const editJsonFile = require("edit-json-file");
const ipcRenderer = electron.ipcRenderer;
const { desktopCapturer} = electron
const fs = require('fs');
const { Atem } = require('atem-connection')


let config = editJsonFile(`${__dirname}/assets/data/config.json`);
$("#themeSwitch").change(function(){
    //$("#valueOfSwitch4").html("false");
    if ($(this).is(':checked')) {
        config.set("theme", "dark")
        config.save();
        console.log("Set")
        document.body.setAttribute('data-theme', 'dark');
    } else {
        document.body.removeAttribute('data-theme');
        config.set("theme", "light")
        config.save();
    }
});

$('#settingsModal').on('show.bs.modal', function () {
    if(config.get("theme") !== "dark"){
        document.getElementById("themeSwitch").removeAttribute("checked")
    }
  })