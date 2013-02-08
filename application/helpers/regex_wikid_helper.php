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

function url_normalize_str ($str) {
	$str = trim($str, ' ');

	$invalid = array('Š'=>'S', 'š'=>'s', 'Đ'=>'Dj', 'đ'=>'dj', 'Ž'=>'Z', 'ž'=>'z',
	'Č'=>'C', 'č'=>'c', 'Ć'=>'C', 'ć'=>'c', 'À'=>'A', 'Á'=>'A', 'Â'=>'A', 'Ã'=>'A',
	'Ä'=>'A', 'Å'=>'A', 'Æ'=>'A', 'Ç'=>'C', 'È'=>'E', 'É'=>'E', 'Ê'=>'E', 'Ë'=>'E',
	'Ì'=>'I', 'Í'=>'I', 'Î'=>'I', 'Ï'=>'I', 'Ñ'=>'N', 'Ò'=>'O', 'Ó'=>'O', 'Ô'=>'O',
	'Õ'=>'O', 'Ö'=>'O', 'Ø'=>'O', 'Ù'=>'U', 'Ú'=>'U', 'Û'=>'U', 'Ü'=>'U', 'Ý'=>'Y',
	'Þ'=>'B', 'ß'=>'Ss', 'à'=>'a', 'á'=>'a', 'â'=>'a', 'ã'=>'a', 'ä'=>'a', 'å'=>'a',
	'æ'=>'a', 'ç'=>'c', 'è'=>'e', 'é'=>'e', 'ê'=>'e',  'ë'=>'e', 'ì'=>'i', 'í'=>'i',
	'î'=>'i', 'ï'=>'i', 'ð'=>'o', 'ñ'=>'n', 'ò'=>'o', 'ó'=>'o', 'ô'=>'o', 'õ'=>'o',
	'ö'=>'o', 'ø'=>'o', 'ù'=>'u', 'ú'=>'u', 'û'=>'u', 'ý'=>'y',  'ý'=>'y', 'þ'=>'b',
	'ÿ'=>'y', 'Ŕ'=>'R', 'ŕ'=>'r', "`" => "'", "´" => "'", "„" => ",", "`" => "'",
	"´" => "'", "“" => "\"", "”" => "\"", "´" => "'", "&acirc;€™" => "'", "{" => "",
	"~" => "", "–" => "-", "’" => "'", " " => "_");
	 
	$str = str_replace(array_keys($invalid), array_values($invalid), $str);
	 
	return $str;
}

function url_kill_apostrophes ($str) {
	$invalid = array("`" => "_", "´" => "_", "„" => "_", "`" => "_",
	"´" => "_", "“" => "_", "”" => "_", "´" => "_", "&acirc;€™" => "_", "{" => "",
	"~" => "", "–" => "-", "’" => "_", "," => "_", "'" => "_");
	 
	$str = str_replace(array_keys($invalid), array_values($invalid), $str);
	 
	return $str;
}
