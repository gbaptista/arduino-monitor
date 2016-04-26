# Arduino Monitor

**Arduino Experiments**

* [Arduino Code to Upload](#arduino-code-to-upload)
* [Install and Run](#install-and-run)


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

```
cat .nvmrc # VERSION

nvm install VERSION

nvm use VERSION

npm install

npm start
```
