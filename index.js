const express = require('express');
const app = express();
const five = require('johnny-five');
//app.use(express.static(__dirname + 'public'));
app.get('/',(req,res)=>{
  res.sendFile(__dirname+ '/public/index.html');
})
app.listen(3000,()=>{
  console.log('listening!');
})

const board = new five.Board();

board.on('ready', ()=>{

  //Instanciar los servos
  const servoHorizontal = new five.Servo({
    pin:10,
    range:[0,180]
  });
  const servoVertical = new five.Servo({
    pin:9,
    range:[0,180]
  });


  //instanciar ldr
  const ldrTopRight = new five.Sensor('A1');
  const ldrTopLeft = new five.Sensor('A2');
  const ldrBottomRight = new five.Sensor('A4');
  const ldrBottomLeft = new five.Sensor('A3');

  this.loop(1500,()=>{
    //obtener valores de las ldrs: 0 - 1023
    let topRight = ldrTopRight.raw;
    let topLeft = ldrTopLeft.raw;
    let bottomRight = ldrBottomRight.raw;
    let bottomLeft = ldrBottomLeft.raw;

    //obtener valores de los servos
    let gradosServoHorizontal=servoHorizontal.value;
    let gradosServoVertical=servoVertical.value;

    //valores correspondientes a la suma de cada lado que forman las ldr
    let sumaTop = topLeft+topRight;
    let sumaRight = topRight+bottomRight;
    let sumaBottom = bottomRight+bottomLeft;
    let sumaLeft = topLeft+bottomLeft;
  
    //movimientos de los servos
    if (sumaTop<sumaBottom) {
      servoVertical.to(gradosServoVertical++);
    }else if (sumaTop>sumaBottom) {
      servoVertical.to(gradosServoVertical--);
    }

    if (sumaLeft>sumaRight) {
      servoHorizontal.to(gradosServoHorizontal++);
    }else if (sumaLeft<sumaRight) {
      servoHorizontal.to(gradosServoHorizontal--);
    }
  })
})
