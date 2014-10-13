<?	
	$curPath = getcwd();
	$fileList = scandir($curPath, 1);
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <title>"javaScript Practice"</title>
    <!-- <link rel="stylesheet" type="text/css" href="css/style.css"> -->
    <style type="text/css">
    #wrapper {
        width: 20%;
        margin: 100px auto;
        padding: 0;
        text-align: center;
    }
    #wrapper h2 {
        color: #FF0000;
        display: inline;
    }
    .menu {
        list-style: initial;
        min-width: 120px;
        text-align: left;
        margin-top: 30px;
    }
    .menu li {
        margin-bottom: 10px;
    }
    .menu li a {
        font-size: 20px;
        color: #333;
    }
    .menu li a:hover {
        text-decoration: underline;
    }
    </style>
</head>

<body>
	<div id="wrapper">
		<h2>Experiments</h2>
		<ul class="menu">
		<? 
			foreach ($fileList as $file) {
				if(is_dir($file) && substr($file, 0, 1) != '.'){
		?>
					<li><a href="<?=$file;?>"><?=$file;?></a></li>
		<?
				}
			}
		?>
		</ul>
	</div>
</body>
</html>
