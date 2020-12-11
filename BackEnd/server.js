const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cmd = require('node-cmd');
const tesseract = require('tesseract.js')
const getColors = require('get-image-colors')
const sharp = require('sharp');
const fs = require('fs')

const userLists = require("./users.json")
const checkLists = require("./check-list.json");
const deviceLists = require("./registered-device.json")
const valueLists = require("./value-list.json")

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.use(function (req, res, next) {

    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "http://localhost:4700");
    res.header("Access-Control-Allow-Methods", "GET,POST");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Content-Type", "application/octet-stream");
    res.removeHeader("X-Powered-By");
    next();
});

// Setting up server
const server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

app.get('/api/test', async (req, res) => {
    res.send('testing');
})

/* Login api*/
app.post('/api/login', async (req, res) => {
    let userId;
    const userArray = userLists.users
    for (let index = 0; index < userArray.length; index++) {
        if (userArray[index]['userId'] === req.body.userId && userArray[index]['password'] === req.body.password) {
            userId = userArray[index]['userId']
        }
    }
    if (userId) {
        res.status(200).send({
            isUserExist: true
        });
    } else {
        res.status(200).send({
            isUserExist: false
        });
    }
})

/* api for checklists operation */
app.get('/api/get-checklists', async (req, res) => {
    let dataset = [];
    let columns = [];
    const checkArray = checkLists.checks
    columns = Object.keys(checkArray[0])
    for (let index = 0; index < checkArray.length; index++) {
        let checkName = checkArray[index]['CheckName'];
        let description = checkArray[index]['Description'];
        dataset.push([checkName, description])
    }
    res.status(200).send({
        dataset: dataset,
        columns: columns
    });
})

app.post('/api/add-checklists', async (req, res) => {
    const checkArray = checkLists;
    checkArray.checks.push(req.body.check)
    fs.writeFile('./check-list.json', JSON.stringify(checkArray), err => {
        if (err) throw err;
    });
    res.status(200).send(JSON.stringify('New check has been added successfully'));
})

app.post('/api/delete-checklists', async (req, res) => {
    const checkArray = checkLists;
    checkArray.checks = checkArray.checks.filter(a => a['CheckName'] !== req.body.checkName)
    fs.writeFile('./check-list.json', JSON.stringify(checkArray), err => {
        if (err) throw err;
    });
    res.status(200).send(JSON.stringify('Selected check has been deleted successfully'));
})
/* Api for device lists operation */
app.get('/api/get-devices', async (req, res) => {
    let dataset = [];
    let columns;
    const deviceArray = deviceLists.devices;
    columns = Object.keys(deviceArray[0])
    for (let index = 0; index < deviceArray.length; index++) {
        let deviceName = deviceArray[index]['DeviceName'];
        let selectedChecks = deviceArray[index]['SelectedChecks'];
        dataset.push([deviceName, selectedChecks])
    }
    res.status(200).send({
        dataset: dataset,
        columns: columns,
        array: deviceArray
    });
})

app.post('/api/add-device', async (req, res) => {
    const deviceArray = deviceLists;
    deviceArray.devices.push(req.body.device)
    fs.writeFile('./registered-device.json', JSON.stringify(deviceArray), err => {
        if (err) throw err;
    });
    res.status(200).send(JSON.stringify('New device has been added successfully'));
})

app.post('/api/delete-device', async (req, res) => {
    const deviceArray = deviceLists;
    const valueArray = valueLists;
    deviceArray.devices = deviceArray.devices.filter(a => a['DeviceName'] !== req.body.device)
    for (let i = 0; i < valueArray.values.length; i++) {
        if (Object.keys(valueArray.values[i])[0] === req.body.device) {
            delete valueArray.values[i]
        }
    }
    valueArray.values = valueArray.values.filter(a => a !== null)
    fs.writeFile('./registered-device.json', JSON.stringify(deviceArray), err => {
        if (err) throw err;
    });
    fs.writeFile('./value-list.json', JSON.stringify(valueArray), err => {
        if (err) throw err;
    });
    res.status(200).send(JSON.stringify('Selected device has been deleted successfully'));
})

app.post('/api/delete-device-check', async (req, res) => {
    const deviceArray = deviceLists;
    const valueArray = valueLists;
    for (let index = 0; index < deviceArray.devices.length; index++) {
        if (deviceArray.devices[index]['DeviceName'] === req.body.device) {
            deviceArray.devices[index]['SelectedChecks'].splice(deviceArray.devices[index]['SelectedChecks'].indexOf(req.body.check), 1)
            delete valueArray.values[index][req.body.device][req.body.check]
        }
    }

    fs.writeFile('./registered-device.json', JSON.stringify(deviceArray), err => {
        if (err) throw err;
    });
    fs.writeFile('./value-list.json', JSON.stringify(valueArray), err => {
        if (err) throw err;
    });
    res.status(200).send(JSON.stringify('Selected devices check has been deleted successfully'));
})

/* Api for value lists */
app.get('/api/get-value-lists', async (req, res) => {
    const valueArray = valueLists.values;
    res.status(200).send(JSON.stringify({
        dataset: valueArray
    }));
})

app.post('/api/add-new-value', async (req, res) => {
    const valueArray = valueLists;
    valueArray.values.push(req.body.value);
    fs.writeFile('./value-list.json', JSON.stringify(valueArray), err => {
        if (err) throw err;
    });
    res.status(200).send(JSON.stringify(''));
})
/*  Api for algorithm check */
app.post('/api/scan-ocr', async (req, res) => {
    let result;
    let imageName = req.body.imageName.toString().split('\\')[2]
    let croppedImage = `croppedImage.jpg`;
    sharp(`./images/${imageName}`).extract({
            width: 200,
            height: 100,
            left: 200,
            top: 80
        }).toFile(`./images/${croppedImage}`)
        .then(function (new_file_info) {
            console.log("Image cropped and saved");
        })
        .catch(function (err) {
            console.log(err);
        });
    tesseract.recognize(`./images/${croppedImage}`, 'eng', {
            logger: m => m
        })
        .then(({
            data: {
                text
            }
        }) => {
            result = text.replace(/(\r\n|\n|\r)/gm, "");
            res.status(200).send(JSON.stringify(result));
        })
})

app.post('/api/measurement-check', (req, res) => {
    let result;
    let imageName = req.body.imageName.toString().split('\\')[2]
    cmd.get(`py ./measurement.py --image ./images/${imageName}`, (err, data, stderr) => {
        if (err) {
            return err;
        }
        result = data.replace(/(\r\n|\n|\r)/gm, "");;
        res.status(200).send(JSON.stringify(result));
    })
})

app.post('/api/color-check', (req, res) => {
    let result;
    let imageName = req.body.imageName.toString().split('\\')[2]
    getColors(`./images/${imageName}`).then(colors => {
        result = colors.map(color => color.hex())
        res.status(200).send(JSON.stringify(result));
    })
})