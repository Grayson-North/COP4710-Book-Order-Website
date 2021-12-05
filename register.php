<?php
	$inData = getRequestInfo();

	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$password = $inData["password"];
	$passwordConfirm = $inData["passwordConfirm"];

	// Create connection
	$conn = new mysqli("localhost", "ultimateAdmin", "COP4710Final", "COP4710");
	// Check connection
	if($conn->connect_error) {
		returnWithError($conn->connect_error);
	} else {
		if (empty($firstName) || empty($lastName) || empty($email) || empty($password) || empty($passwordConfirm)) { // Check for empty fields
			returnWithError("Fill in all the required fields");
			exit();
		}

		if ($password !== $passwordConfirm) { // Check if passwords match
			returnWithError("Passwords do not match");
			exit();
		}

		if (checkIfUserExists($conn, $inData["email"])) { // Check if user with 'login' already exists
			returnWithError("User already exists");
			exit();
		}

		if (createUser($conn, $inData["firstName"], $inData["lastName"], $inData["email"], $inData["password"])) {
			$userInfo = getUserInfoByLogin($conn, $email);
			returnWithInfo($userInfo["UserId"]);
		} else {
			returnWithError("Error creating user");
			exit();
		}
	}

	function getUserInfoByLogin($conn, $email)
	{
		// Returns an array of firstName, lastName, and ID from user with Login "$login"
		$result = $conn->query("SELECT FirstName, LastName, UserId FROM Users WHERE Email = '$email'") or die($conn->error);
		return $result->fetch_assoc();
	}

	function createUser($conn, $firstName, $lastName, $email, $password)
	{
		$result = $conn->query("INSERT INTO Users (Password,Email,FirstName,LastName,Admin) VALUES ('$password', '$email', '$firstName', '$lastName', 0)");
		return $result;
	}

	function checkIfUserExists($conn, $email)
	{
		$result = $conn->query("SELECT * FROM Users WHERE Email = '$email'");
		return $result->num_rows > 0;
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"id":-1,"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $id )
	{
		$retValue = '{"id":' . $id . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>