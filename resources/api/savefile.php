<?php

	$data = $_REQUEST['data'];
	
	header('Content-type: text/xml');
	header('Content-Disposition: attachment; filename="meta.xml"');
	$data = stripslashes($data);
	print $data;
?>