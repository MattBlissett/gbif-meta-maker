<?php

	$data = $_REQUEST['data'];		
	header('Content-type: text/xml');
	header('Content-Disposition: attachment; filename="meta.xml"');
	if (get_magic_quotes_gpc()) {
		$data = stripslashes($data);
	}
	print $data;
?>