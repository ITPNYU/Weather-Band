create database weather_data;
use weather_data;

CREATE TABLE data (
	id INT AUTO_INCREMENT PRIMARY KEY,
	mac_address CHAR(17) NOT NULL,
	recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	wind_dir INTEGER,
	winddir_avg2m INTEGER,
	windspeedmph FLOAT,
	windgustdir_10m INTEGER,
	windgustmph_10m FLOAT,
	rainin FLOAT,
	dailyrainin FLOAT,
	rain_avg1m FLOAT,
	rain_avg10m FLOAT,
	temperature FLOAT,
	humidity FLOAT,
	pressure FLOAT,
	illuminance FLOAT,
	uva FLOAT,
	uvb FLOAT,
	uvindex FLOAT
);

CREATE TABLE authorized_device (
	mac_address char(17) NOT NULL PRIMARY KEY,
	session_key TEXT
);

INSERT INTO authorized_device (mac_address, session_key) VALUES ('AA:BB:CC:DD:EE:FF', '12345678');