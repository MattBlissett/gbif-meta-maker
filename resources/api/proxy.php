<?php

	if ($_REQUEST['type'] == "json") {
		header ("content-type: application/json");
	} else {
		header ("content-type: text/xml");
	}
	
	$url = urldecode($_REQUEST["url"]);	
	if ($url != '') {
		$response = file_get_contents($url);
	}
	
	$s_list = array('dc:description=');
	$r_list = array('description=');
	print str_replace($s_list, $r_list, $response);

?>