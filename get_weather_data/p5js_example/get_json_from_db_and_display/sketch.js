// ITP Weather Band: GET Example
// this sketch gets weather data (JSON) from the weather band database and display the data.
// this example is written by Yeseul. the database is developed by Name and Cy. 
// November 2020
// feel free to modify and play with it for your project!


let recorded_at= [];
let wind_dir = [];
let winddir_avg2m = [];
let windspeedmph = [];
let rainin = [];
let dailyrainin = [];
let temperature = [];
let humidity = [];
let pressure = [];
let illuminance = [];
let uva = [];
let uvb = [];
let uvindex = [];


function setup() {
  createCanvas(1000, 1000);
  // Request the data from the weather band database
  let url = 'https://cors-anywhere.herokuapp.com/http://157.230.182.5:8000/data/all?macAddress=A4:CF:12:8A:C8:24';
  loadJSON(url, gotWeather);
}

function draw() {
  background(135, 206, 235);
  drawGraphs();
}

function gotWeather(weatherData) {  

  for (i = 0; i < weatherData.length; i++) {
    recorded_at.push(weatherData[i].recorded_at);
    wind_dir.push(weatherData[i].wind_dir);
    winddir_avg2m.push(weatherData[i].winddir_avg2m);
    windspeedmph.push(weatherData[i].windspeedmph);
    rainin.push(weatherData[i].rainin);
    dailyrainin.push(weatherData[i].dailyrainin);
    temperature.push(weatherData[i].temperature);
    humidity.push(weatherData[i].humidity);
    pressure.push(weatherData[i].pressure);
    illuminance.push(weatherData[i].illuminance);
    uva.push(weatherData[i].uva);
    uvb.push(weatherData[i].uvb);
  }
  // console.log(recorded_at);
  // console.log(wind_dir);
  // console.log(winddir_avg2m);
  // console.log(windspeedmph);
  // console.log(rainin);
  // console.log(dailyrainin);
  // console.log(temperature);
  // console.log(windspeedmph);
  // console.log(humidity);
  // console.log(pressure);
  // console.log(illuminance);
  // console.log(uva);
  // console.log(uvb);
}

function drawGraphs() {
  text("rainin", 30, 80);
  for (i = 0; i < recorded_at.length; i++) {
    let mapped = map(rainin[i], 0, 0.8, 100, 50);
    ellipse(130+i*3, mapped, 2, 2);        
  }
  text("dailyrainin", 30, 180);
  for (i = 0; i < recorded_at.length; i++) {
    let mapped = map(dailyrainin[i], 0, 1, 200, 150);
    ellipse(130+i*3, mapped, 2, 2);        
  }
  text("wind_dir", 30, 280);
  for (i = 0; i < recorded_at.length; i++) {
    let mapped = map(wind_dir[i], 0, 315, 300, 250);
    ellipse(130+i*3, mapped, 2, 2);        
  }
  text("windspeedmph", 30, 380);
  for (i = 0; i < recorded_at.length; i++) {
    let mapped = map(windspeedmph[i], 0, 3, 400, 350);
    ellipse(130+i*3, mapped, 2, 2);        
  }
  text("temperature", 30, 480);
  for (i = 0; i < recorded_at.length; i++) {
    let mapped = map(temperature[i], 10, 70, 500, 450);
    ellipse(130+i*3, mapped, 2, 2);        
  }
  text("illuminance", 30, 580);
  for (i = 0; i < recorded_at.length; i++) {
    let mapped = map(illuminance[i], 0, 2500, 600, 550);
    ellipse(130+i*3, mapped, 2, 2);        
  }
  text("uv index", 30, 680);
  for (i = 0; i < recorded_at.length; i++) {
    let mapped = map(uvindex[i], 0, 4, 700, 650);
    ellipse(130+i*3, mapped, 2, 2);        
  }
  text("humidity", 30, 780);
  for (i = 0; i < recorded_at.length; i++) {
    let mapped = map(humidity[i], 0, 100, 800, 750);
    ellipse(130+i*3, mapped, 2, 2);        
  }
}

  