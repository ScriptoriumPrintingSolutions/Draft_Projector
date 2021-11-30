const cp = require('child_process')
const express = require('express')
var Gpio = require 	('onoff')//Include onoff to interact with Gpio
var ssr = new Gpio(4, 'out')//Using Gpio pin 4 & specifying its an output.
ssr.writeSync(0); 
const app = express()

//API endpoint will get a request from the controller on which an image will be projected for a prerequisite time.
//We will be using a child process to project an image abd remove a projection.


app.get('/projection', function (req, res), {

    try {
  
      //running first child process synchronously
patternON();
        const data = cp.execSync('export DISPLAY=:0' , function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
        //After opening the pattern the childprocess will sleep for 4 sec and then kill gpicview
        const data1 = cp.execSync('sudo gpicview  /home/pi/3d-scanner-projector/img/pattern.png & sleep 7; pkill gpicview', function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
patternOFF();
    } catch (err) {

        res.send('Image not uploaded')

    }
})
function patternON(){
	ssr.writeSync(1);
	}
function patternOFF(){
	ssr.writeSync(0);
	ssr.unexport();
	}

app.listen(3000, () => {
    console.log('Server is running in port 3000')
})
