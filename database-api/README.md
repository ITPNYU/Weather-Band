# Weather Server

Adapted from Don Coleman's Connected Devices [source code](https://github.com/don/itp-connected-devices) and referenced Brent Bailey's ITPower Weather Server [repo](https://github.com/brondle/itpower-weather-server)

Want to know what the weather is like in NYC right now? Or from a month ago? How about fetching a bunch of information from over time? ITP's Weatherband's weather station and server has been diligently capturing that and storing it in a database as of November 25th 2020 2:00PM EST and is available for you to use.

#### Weather Information
| data point      | type  |
|-----------------|-------|
| wind_dir        | int   |
| winddir_avg2m   | int   |
| windspeedmph    | float |
| windgustdir_10m | int   |
| windgustmph_10m | float |
| rainin          | float |
| dailyrainin     | float |
| rain_avg1m      | float |
| rain_avg10m     | float |
| temperature     | float |
| humidity        | float |
| pressure        | float |
| illuminance     | float |
| uva             | float |
| uvb             | float |
| uvindex         | float |

### The API

The entirety of the New York City database can be read from here: 
[http://weatherband.itp.io:3000/data/all?macAddress=A4:CF:12:8A:C8:24](http://weatherband.itp.io:3000/data/all?macAddress=A4:CF:12:8A:C8:24)

The macAddress is specific to each weather station that is online. There will be other addresses that will be available when we set up stations in other locations around the world through our ITP global student network! 

`A4:CF:12:8A:C8:24` - New York City, New York

To access other locations' database in the future change the macAddress field in the url.

#### GET
**to read all records /data via cURL**
```curl -X GET -d macAddress=A4:CF:12:8A:C8:24 http://weatherband.itp.io:3000/data/all```

**by /id**
```curl -X GET -d macAddress=A4:CF:12:8A:C8:24 http://weatherband.itp.io:3000/id/1```

**by /category**
```curl -X GET -d macAddress=A4:CF:12:8A:C8:24 -d category=wind_dir,rainin http://weatherband.itp.io:3000/data/category```

**by /date**
```curl -X GET -d macAddress=A4:CF:12:8A:C8:24 -d from='2020-11-25' -d to='2020-11-27' http://weatherband.itp.io:3000/data/date```

**by /date including time**
```curl -X GET -d macAddress=A4:CF:12:8A:C8:24 -d from='2020-11-25T13' -d to='2020-11-27T09' http://weatherband.itp.io:3000/data/date```
Here we are getting data from 2020-11-25 1:00pm - 2020-11-27 9:00am. For more specifics on the time format, check the [moment.js documentation](https://momentjs.com/docs/#/parsing/)

#### POST
If you want to setup your own weather station in a new location, come talk to us! We can provide you additional information including the session key needed to post data and set up a new table for your entries.
