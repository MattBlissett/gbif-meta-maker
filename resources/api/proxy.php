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
	$output = str_replace($s_list, $r_list, $response);
	if ($_REQUEST['hide']) {
		$tmp = json_decode($output, true);		
		for($i=0; $i<= count($tmp["extensions"]); $i++) {
			if (($tmp["extensions"][$i]["title"] == "Darwin Core Occurrence")
			|| ($tmp["extensions"][$i]["title"] == "Darwin Core Taxon")) {
				unset($tmp["extensions"][$i]);
			}
		}
		$output = json_encode($tmp);
	}
	print $output;

?>