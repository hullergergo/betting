'use strict';

function getData(url) {
	var xhr = new XMLHttpRequest();
	//hr.onload = function() {
	//};
	xhr.open('GET', url, true);
	xhr.send();
	var resposeTrasferedToObject = xhr.response;
	return resposeTrasferedToObject;
};

function postData(url, data) {
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		var resposeTrasferedToObject = xhr.response;
		console.debug(resposeTrasferedToObject);
	};
	xhr.open('POST', url, true);
	xhr.send(data);
};