<?php

	header ("content-type: text/xml");
	
	$url = urldecode($_REQUEST["url"]);	
	if ($url != '') {
		print file_get_contents($url);
	}

?>