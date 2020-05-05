const {app, BrowserWindow} = require('electron')
const { ipcMain } = require('electron');
var id = 0;

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: "./src/assets/images/icon.jpg",
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadFile('./src/index.html')

    //IPC Start Here
    ipcMain.handle('start', async (event) => {
        let outPut = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true,
                width: 400,
                height: 200,
                icon: "./src/assets/images/icon.jpg",
                backgroundColor: '#000000',
                frame: false
            }
        })
        outPut.on('close', function() {
            outPut = null
        })
        outPut.loadFile('./src/sportsMediaOut.html')
        id = outPut.id;
        //** REMOVE BEFORE PUBLISH outPut.removeMenu();
        outPut.once('ready-to-show', () => {
            outPut.show()
        });
        BrowserWindow.fromId(id).webContents.send('info', {
            msg: 'hello from main process'
        });
    })
//Add Point
    ipcMain.handle('point', async (event, team, num) => {
        BrowserWindow.fromId(id).webContents.send('point', {
            points: num,
            team: team,
        });
    });

//Remove Point
    ipcMain.handle('delPoint', async (event, num, team) => {
        BrowserWindow.fromId(id).webContents.send('delPoint', {
            points: num,
            team: team
        });
    });

//Clock Control
ipcMain.handle('clock', async (event, action, newTime) => {
    BrowserWindow.fromId(id).webContents.send('clock', {
        action: action,
        newTime: newTime,
    });
});

//Clock Done
ipcMain.handle('clockDone', async (event) => {
    BrowserWindow.fromId(win.id).webContents.send('clockDone')
});

//Set Quarter
ipcMain.handle('setQuarter', async (event, quarter) => {
    BrowserWindow.fromId(id).webContents.send('setQuarter', {
        quarter: quarter,
    });
});

//Current Time
ipcMain.handle('currentTime', async (event, min, sec) => {
    BrowserWindow.fromId(win.id).webContents.send('currentTime', {
      min : min,
      sec : sec,
    })
});

//Scoreboard Init
ipcMain.handle('init', async(event, name, startTime, color) =>{
  BrowserWindow.fromId(id).webContents.send('init', {
      otherName : name,
      startTime : startTime,
      otherColor : color,
  });
});

}

//Other
app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
