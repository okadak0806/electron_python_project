const {PythonShell} = require('python-shell');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

app.on('window-all-closed', function () {
    app.quit();
});

app.on('ready', function () {
    PythonShell.run('app.py', null, function (err, result) {
        if (err) throw err;
        console.log(result);
    });
    const rq = require('request-promise');
    const mainAddr = 'http://localhost:5000';

    const openWindow = function () {
        mainWindow = new BrowserWindow({width: 400, height: 300});
        mainWindow.loadURL(mainAddr);

        // enable devtools
        // mainWindow.webContents.openDevTools();

        //end function
        mainWindow.on('closed', function () {

            // delete caches
            electron.session.defaultSession.clearCache(() => {
            })
            mainWindow = null;
        });
    };

    const startUp = function () {
        rq(mainAddr)
            .then(function (htmlString) {
                console.log('server started');
                openWindow();
            })
            .catch(function (err) {
                startUp();
            });
    };

    startUp();

});