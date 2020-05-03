const {
    app,
    BrowserWindow
} = require('electron')
const {
    ipcMain
} = require('electron');
var id = 0;

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: "./src/assets/images/icon.jpg",
        webPreferences: {
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    win.loadFile('./src/index.html')

    // Open the DevTools.
    win.webContents.openDevTools()
    // Attach event listener to event that requests to update something in the second window
    // from the first window

    //IPC START HERE
    ipcMain.handle('init', async (event, someArgument) => {
        //console.log(someArgument)
        let outPut = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true,
                width: 400,
                height: 200,
                icon: "./src/assets/images/icon.jpg"
                //backgroundColor: '#2e2c29'
            }
        })
        outPut.on('close', function() {
            outPut = null
        })
        outPut.loadFile('./src/sportsMediaOut.html')
        id = outPut.id;
        outPut.once('ready-to-show', () => {
            outPut.show()
        });
        BrowserWindow.fromId(id).webContents.send('info', {
            msg: 'hello from main process'
        });
    })

    ipcMain.handle('addPoint', async (event, num, team) => {
        BrowserWindow.fromId(id).webContents.send('addPoint', {
            points: num,
            team: team
        });
    });
    ipcMain.handle('delPoint', async (event, num, team) => {
        BrowserWindow.fromId(id).webContents.send('delPoint', {
            points: num,
            team: team
        });
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
var windowArray = BrowserWindow.getAllWindows();

function getWindow(windowName) {
    console.log(windowArray);
    for (var i = 0; i < windowArray.length; i++) {
        if (windowArray[i].name == windowName) {
            return windowArray[i].window;
        }
        console.log(windowArray[i].name);
    }
    return null;
}


function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}
