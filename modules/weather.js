var misaoUtil = require('../util.js');
var http = require('http');
var libxmljs = require('libxmljs');

module.id = 'weather';

exports.execute = function(msg, callback) {
	var resultsRawBody = '';
	http.get({ host: 'www.google.com',
			   port: 80,
			   path: encodeURI('/ig/api?weather=' + misaoUtil.stripText(msg))
			 },
			 function(response) {
			 	response.on('data', function(chunk) {
			 		resultsRawBody += chunk;
			 	});
			 	response.on('end', function() {
			 		var weather = libxmljs.parseXmlString(resultsRawBody);
			 		if(weather.get('//problem_cause')){
			 			if(weather.get('//problem_cause').attr('data').value() == '') {
			 				callback("Unable to find weather data for " + misaoUtil.stripText(msg));
			 			} else {
			 				callback(weather.get('//problem_cause').attr('data').value());
			 			}
			 		} else {
				 		var city = weather.get('//city').attr('data').value();
				 		var postal_code = weather.get('//postal_code').attr('data').value();
				 		var condition = weather.get('//condition').attr('data').value();
				 		var wind_condition = weather.get('//wind_condition').attr('data').value();
				 		var humidity = weather.get('//humidity').attr('data').value();
				 		var temp_f = weather.get('//temp_f').attr('data').value();
				 		var temp_c = weather.get('//temp_c').attr('data').value();
				 		
				 		callback(city + ": " + temp_f + "°F / " + temp_c + "°C, " + condition + " - " + humidity + " - " + wind_condition);
				 	}
			 	});
			 });
};

exports.help = "Get the weather for a given city or postal code. Usage: weather <query>"
