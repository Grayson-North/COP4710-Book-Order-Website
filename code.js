var urlBase = '142.93.66.126';//
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

var conID = 0;
var conFirstName = "";
var conLastName = "";
var conEmail = "";
var conPhone = 0;


function doLogin() {
	var login = document.getElementById("email").value;
	var password = document.getElementById("password").value;
	//	var hash = md5( password );

	var tmp = { email: email, password: password };
	//	var tmp = {login:login,password:hash};
	var jsonPayload = JSON.stringify(tmp);

	var url ='/LAMPAPI/login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				var jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;

				if (userId < 1) {
					document.getElementById("loginResult").innerHTML = "User/Password is incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "index.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function welcoming(){
	var data = document.cookie;
	var splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		}
		else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}
	document.getElementById("welcome").innerHTML = "Welcome " + firstName + " " + lastName;
}

function doSignIn() {
	window.location.href = "login.html";
}


function doRegister() {
	firstName = document.getElementById("firstName").value;
	lastName = document.getElementById("lastName").value;
	var email = document.getElementById("email").value;
	var password = document.getElementById("password").value;
	var verifyPass = document.getElementById("passwordConfirm").value;
	
	var tmp = { firstName: firstName, lastName: lastName, email: email, password: password,  passwordConfirm: verifyPass};
	var jsonPayload = JSON.stringify(tmp);

	var url ='/LAMPAPI/register.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				var jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;
				if (userId < 1) {
					document.getElementById("PasswordError").innerHTML = jsonObject.error;
					setTimeout(function() {
						document.getElementById("PasswordError").innerHTML = "";
					}, 3000);
					return;
				}
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
				saveCookie();
				window.location.href = "login.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("PasswordError").innerHTML = err.message;
	}
}

function saveCookie() {
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		}
		else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}

	if (userId < 0) {
		window.location.href = "index.html";
	}
	else {
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}