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
		$tmp = json_decode($output);
		if ($tmp->extensions) {
		foreach($tmp->extensions as $key => $rec) {
			if (($rec->title == "Darwin Core Occurrence")
			|| ($rec->title == "Darwin Core Taxon")) {
				unset($tmp->extensions[$key]);
			}
		}
		} else {
			$tmp->extensions = array();
		}
		$tmp->extensions = array_values($tmp->extensions);
		$output = json_encode($tmp);
	}

	print $output;

?>