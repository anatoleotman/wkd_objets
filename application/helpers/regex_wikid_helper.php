<?php

//fonctions de recherche/remplace du wikid

function wikid_config_search_replace($original_string, $object_context) {

	$patterns = array(
		'#_AUTOCONFIGWIKID_paypal_email_AUTOCONFIGWIKID_#',
		'#_AUTOCONFIGWIKID_site_url_AUTOCONFIGWIKID_#',
		'#_AUTOCONFIGWIKID_admin_email_AUTOCONFIGWIKID_#'
	);
	
	$replace = array(
		$object_context->config->item('paypal_email'),
		$object_context->config->item('base_url'),
		$object_context->config->item('admin_email')			
	);
	
	$corrected_string = preg_replace($patterns, $replace, $original_string);
	return $corrected_string;
}