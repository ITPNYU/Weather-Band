// ITP Weather Band: GET Example
// this sketch gets weather data (JSON) from the weather band database and display the data.
// this example is written by Yeseul. the database is developed by Name and Cy.
// see the json data here http://157.230.182.5:3000/data/all?macAddress=A4:CF:12:8A:C8:24
// November 2020
// feel free to modify and play with it for your project!

// making arrays for each weather data so you can access easily
let recorded_at = []; // the timezone is GMT
let windDir = [];
let windDir_avg2m = [];
let windSpeedMph = [];
let rainIn = [];
let dailyRainIn = [];
let temperature = [];
let humidity = [];
let pressure = [];
let illuminance = [];
let uva = [];
let uvb = [];
let uvIndex = [];

// set which data you want to start from with its session id
const starting_id = 30;

function setup() {
  createCanvas(5000, 900);

  // Request the data from the weather band database
  const url =
    "https://cors-anywhere.herokuapp.com/http://weatherband.itp.io:3000/data/all?macAddress=A4:CF:12:8A:C8:24";

  // load the json file
  loadJSON(url, gotWeather);
}

function draw() {
  background(230, 251, 255);
  drawGraphs();
}

function gotWeather(weatherData) {
  // add each weather data to the arrays
  for (i = starting_id; i < weatherData.length; i++) {
    recorded_at.push(weatherData[i].recorded_at);
    windDir.push(weatherData[i].wind_dir);
    windDirAvg2m.push(weatherData[i].winddir_avg2m);
    windSpeedMph.push(weatherData[i].windspeedmph);
    rainIn.push(weatherData[i].rainin);
    dailyRainIn.push(weatherData[i].dailyrainin);
    temperature.push(weatherData[i].temperature);
    humidity.push(weatherData[i].humidity);
    pressure.push(weatherData[i].pressure);
    illuminance.push(weatherData[i].illuminance);
    uva.push(weatherData[i].uva);
    uvb.push(weatherData[i].uvb);
    uvIndex.push(weatherData[i].uvindex);
  }

  // pring out the arrays loaded with weather data
  // console.log(recorded_at);
  // console.log(windDir);
  // console.log(windDirAvg2m);
  // console.log(windSpeedMph);
  // console.log(rainIn);
  // console.log(dailyRainIn);
  // console.log(temperature);
  // console.log(windSpeedMph);
  // console.log(humidity);
  // console.log(pressure);
  // console.log(illuminance);
  // console.log(uva);
  // console.log(uvb);
}

function drawGraphs() {
  // draw linear graphs for each data to see the trend
  // the mapping is done based on the average range of each weather data
  text("Weather data from " + recorded_at[0] + "(GMT) and onwards", 30, 40);
  text("Data collected with a DIY weather station in East Village, NY", 30, 55);
  text("rainIn", 30, 100);
  for (i = 0; i < recorded_at.length; i++) {
    let mapped = map(rainIn[i], 0, 0.8, 150, 100);
    ellipse(130 + i, mapped, 0.5, 0.5);
  }
  text("dailyRainIn", 30, 200);
  for (i = 0; i < recorded_at.length; i++) {
    let mapped = map(dailyRainIn[i], 0, 1, 250, 200);
    ellipse(130 + i, mapped, 0.5, 0.5);
  }
  text("wind_dir", 30, 300);
  for (i = 0; i < recorded_at.length; i++) {
    let mapped = map(windDir[i], 0, 315, 350, 300);
    ellipse(130 + i, mapped, 0.5, 0.5);
  }
  text("windSpeedMph", 30, 400);
  for (i = 0; i < recorded_at.length; i++) {
    let mapped = map(windSpeedMph[i], 0, 5, 450, 400);
    ellipse(130 + i, mapped, 0.5, 0.5);
  }
  text("temperature", 30, 500);
  for (i = 0; i < recorded_at.length; i++) {
    let mapped = map(temperature[i], 10, 70, 550, 500);
    ellipse(130 + i, mapped, 0.5, 0.5);
  }
  text("illuminance", 30, 600);
  for (i = 0; i < recorded_at.length; i++) {
    let mapped = map(illuminance[i], 0, 2500, 650, 600);
    ellipse(130 + i, mapped, 0.5, 0.5);
  }
  text("uvIndex", 30, 700);
  for (i = 0; i < recorded_at.length; i++) {
    let mapped = map(uvIndex[i], 0, 4, 750, 700);
    ellipse(130 + i, mapped, 0.5, 0.5);
  }
  text("humidity", 30, 800);
  for (i = 0; i < recorded_at.length; i++) {
    let mapped = map(humidity[i], 0, 100, 850, 800);
    ellipse(130 + i, mapped, 0.5, 0.5);
  }
}
