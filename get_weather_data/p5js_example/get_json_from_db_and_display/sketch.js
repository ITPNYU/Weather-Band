// ITP Weather Band: GET Example
// this sketch gets weather data (JSON) from the weather band database and display the data.
// this example is written by Yeseul. the database is developed by Name and Cy. 
// see the json data here http://157.230.182.5:3000/data/all?macAddress=A4:CF:12:8A:C8:24
// November 2020
// feel free to modify and play with it for your project!

// making arrays for each weather data so you can access easily
let recorded_at= []; // the timezone is GMT
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

// set which data you want to start from with its session id
let starting_id = 30;

function setup() {
  createCanvas(5000, 900);
  
  // Request the data from the weather band database
  let url = 'https://cors-anywhere.herokuapp.com/http://weatherband.itp.io:3000/data/all?macAddress=A4:CF:12:8A:C8:24';
  
  // load the json file
  loadJSON(url, gotWeather);
}

function draw() {
  background(230,251,255);
  drawGraphs();
}

function gotWeather(weatherData) {  

  // add each weather data to the arrays
  for (i = starting_id; i < weatherData.length; i++) {
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
    uvindex.push(weatherData[i].uvindex);
  }
  
  // pring out the arrays loaded with weather data
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
  
  // draw linear graphs for each data to see the trend
  // the mapping is done based on the average range of each weather data
  text("Weather data from " + recorded_at[0] + "(GMT) and onwards", 30, 40);
  text("Data collected with a DIY weather station in East Village, NY", 30, 55);
  text("rainin", 30, 100);
  for (i = 0; i < recorded_at.length; i++) {
    let mapped = map(rainin[i], 0, 0.8, 150, 100);
    ellipse(130+i, mapped, 0.5, 0.5);        
  }
  text("dailyrainin", 30, 200);
  for (i = 0; i < recorded_at.length; i++) {
    let mapped = map(dailyrainin[i], 0, 1, 250, 200);
    ellipse(130+i, mapped, 0.5, 0.5);        
  }
  text("wind_dir", 30, 300);
  for (i = 0; i < recorded_at.length; i++) {
    let mapped = map(wind_dir[i], 0, 315, 350, 300);
    ellipse(130+i, mapped, 0.5, 0.5);      
  }
  text("windspeedmph", 30, 400);
  for (i = 0; i < recorded_at.length; i++) {
    let mapped = map(windspeedmph[i], 0, 5, 450, 400);
    ellipse(130+i, mapped, 0.5, 0.5);        
  }
  text("temperature", 30, 500);
  for (i = 0; i < recorded_at.length; i++) {
    let mapped = map(temperature[i], 10, 70, 550, 500);
    ellipse(130+i, mapped, 0.5, 0.5);        
  }
  text("illuminance", 30, 600);
  for (i = 0; i < recorded_at.length; i++) {
    let mapped = map(illuminance[i], 0, 2500, 650, 600);
    ellipse(130+i, mapped, 0.5, 0.5);        
  }
  text("uv index", 30, 700);
  for (i = 0; i < recorded_at.length; i++) {
    let mapped = map(uvindex[i], 0, 4, 750, 700);
    ellipse(130+i, mapped, 0.5, 0.5);        
  }
  text("humidity", 30, 800);
  for (i = 0; i < recorded_at.length; i++) {
    let mapped = map(humidity[i], 0, 100, 850, 800);
    ellipse(130+i, mapped, 0.5, 0.5);        
  }
}

  
