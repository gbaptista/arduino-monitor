# Arduino Monitor

Arduino monitor interface for experiments.

A desktop app built on [Electron](http://electron.atom.io/).

* Demos:
  - [Control Leds with a Potentiometer](#control-leds-with-a-potentiometer)
  - [Voltage Through the Tongue:](#voltage-through-the-tongue)
* [Arduino Code to Upload](#arduino-code-to-upload)
* [Install and Run](#install-and-run)


#### Control Leds with a Potentiometer:
[![Control Leds with a Potentiometer](https://github.com/gbaptista/arduino-monitor/raw/master/demos/demo-led.png)](https://www.youtube.com/watch?v=J7ZGo12p-gg)

#### Voltage Through the Tongue:
[![Voltage Through the Tongue ](https://github.com/gbaptista/arduino-monitor/raw/master/demos/demo-tongue.png)](https://www.youtube.com/watch?v=VGq5nEkoSQ8)

## Arduino Code to Upload
```c_cpp
float A_0 = 0;
float A_1 = 0;
float A_2 = 0;
float A_3 = 0;
float A_4 = 0;
float A_5 = 0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  A_0 = analogRead(0);
  A_1 = analogRead(1);
  A_2 = analogRead(2);
  A_3 = analogRead(3);
  A_4 = analogRead(4);
  A_5 = analogRead(5);
    
  Serial.print("A0:"); Serial.println(A_0);
  Serial.print("A1:"); Serial.println(A_1);
  Serial.print("A2:"); Serial.println(A_2);
  Serial.print("A3:"); Serial.println(A_3);
  Serial.print("A4:"); Serial.println(A_4);
  Serial.print("A5:"); Serial.println(A_5);
};
```

## Install and Run

You can use [nvm](https://github.com/creationix/nvm) to switch between node versions:

```
nvm install 4.1.1

nvm use 4.1.1

npm install

npm start
```
