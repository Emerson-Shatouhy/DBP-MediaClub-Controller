let stats = editJsonFile(`${__dirname}/assets/data/sports.json`);
let startTime = "0";
let otherColor = "";
let clockRunning = false;
//Opens Modal on Start
$(document).ready(function () {
  $('#mainModal').modal('show')

});
//Keybindings

Mousetrap.bind('enter', function () {
  if (clockRunning) {
    clock("stop");
  } else {
    clock("start");
  }
});

Mousetrap.bind('ctrl+up', function () {
  points("bosco", 1, "+");
});
Mousetrap.bind('ctrl+down', function () {
  points("bosco", 1, "-");
});
Mousetrap.bind('shift+up', function () {
  points("other", 1, "+");
});
Mousetrap.bind('shift+down', function () {
  points("other", 1, "-");
});

//Modal Control
function modalSubmit() {
  stats.set("otherTeam", document.forms["modalForm"]["vistingTeam"].value);
  otherColor = (document.forms["modalForm"]["otherColor"].value);
  var current = document.getElementById("opponent").innerHTML;
  document.getElementById("opponent").innerHTML = stats.get("otherTeam") + " " + current;
  stats.set("boscoScore", 0);
  stats.set("otherScore", 0);
  if (document.forms["modalForm"]["sportControl"].value == "Football") {
    document.getElementById("clockSet").value = "15:00";
    startTime = "15:00";
  } else if (document.forms["modalForm"]["sportControl"].value == "Soccer") {
    document.getElementById("clockSet").value = "15:00";
    startTime = "15:00";
  } else if (document.forms["modalForm"]["sportControl"].value == "Soccer") {
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
  ipcRenderer.invoke('init', stats.get("otherTeam"), startTime, otherColor);
}

//Output Control
const BrowserWindow = electron.remote.BrowserWindow
$(".btnSeccion").click(function (event) {
  btnMostrarSeccion($(this));
  event.preventDefault();
})

//Clock Control
function clock(arg) {
  if (arg == "start") {
    document.getElementById("clockSet").setAttribute('disabled', 'true');
    ipcRenderer.invoke('clock', 'start');
    clockRunning = true;
  }
  if (arg == "stop") {
    ipcRenderer.invoke('clock', 'stop');
    document.getElementById("clockSet").removeAttribute('disabled');
    clockRunning = false;
  }
  if (arg == "set") {
    ipcRenderer.invoke('clock', 'set', document.getElementById("clockSet").value);
  }
}

//Clock Done Alert
ipcRenderer.on('clockDone', function (event) {
  document.getElementById("clockSet").removeAttribute('disabled');
});

//Current Time
ipcRenderer.on('currentTime', function (event, data) {
  var newTime = data.min + ":" + data.sec;
  document.getElementById("clockSet").value = newTime.toString();
});

//Set Quarter
function quarter() {
  ipcRenderer.invoke('setQuarter', document.getElementById("quarterSet").value);
}

//Point Control
function points(team, points, action) {
  var teamID = team + "Score";
  currentScore = Number(document.getElementById(teamID).innerHTML);
  switch (action) {
    case "+":
      var newScore = document.getElementById(teamID).innerHTML = currentScore + Number(points);
      ipcRenderer.invoke('point', teamID, newScore);
      break;
    case "-":
      if (currentScore > 0) {
        var newScore = document.getElementById(teamID).innerHTML = currentScore - Number(points);
        ipcRenderer.invoke('point', teamID, newScore);
      }
      break;
  }
}

//Set Down
function down(){
  ipcRenderer.invoke('setDown', document.getElementById("downSet").value);
}


//Set Yards To Go
function YtG(){
  ipcRenderer.invoke('setYTG', document.getElementById("ytgSet").value);
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


function initTheme() {

  darkSwitch.checked = darkThemeSelected;
  darkThemeSelected ? document.body.setAttribute('data-theme', 'dark') :
    document.body.removeAttribute('data-theme');
}

function resetTheme() {
  if (darkSwitch.checked) {
    document.body.setAttribute('data-theme', 'dark');
    localStorage.setItem('darkSwitch', 'dark');
  } else {
    document.body.removeAttribute('data-theme');
    localStorage.removeItem('darkSwitch');
  }
}