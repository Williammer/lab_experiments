<?php
	
	$email = isset($_POST['email'])? $_POST['email'] : '';
	$pwd = isset($_POST['password'])? $_POST['password'] : '';
	$remember = isset($_POST['remember'])? $_POST['remember'] : false;
	$token = isset($_POST['token'])? $_POST['token'] : '';

	$resp_data = "Email: ".$email."; password: ".$pwd."; token: ".$token;

	echo json_encode($resp_data);
?>
