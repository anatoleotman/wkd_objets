<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
// ici je regroupe les fonctions pour construire du html coté serveur
// utiliser template php

class Build_html_menu {
	
	private $ci;
	
	public function __construct () {
		// Do something with $params
		// $this->list_menu = $params;
		$this->ci =& get_instance();
		$this->ci->load->helper('url');
    	}
	
	public function show_menu ($list_menu) { 
	// construit du html :une simple liste imbriquée pour le menu en mode no javascript
	// utiliser template php
	          //print_r($this->list_menu);
	          if (isset($list_menu)) {
	          	$menu ='<ul id="menu_liste" class="menu_liste">';
	          	foreach ($list_menu as $data) {
	          		if ($data['parent'] == 'racine') {
	          			$menu .= '<li class="categorie">';
	          			$menu .= anchor("sync/show/".$data['alias_page'],$data['alias_nom']);
	          			$menu .= '<ul class="submenu">';	       		
	          			foreach ($list_menu as $data1) {
	          				if ($data1['parent'] == $data['alias_nom']) {	          		          								$menu .= '<li class="submenu_item">';
	          					$menu .= anchor("sync/show/".$data1['alias_page'],$data1['alias_nom']);
	          					$menu .= "</li>";
	          				}	          			
	          			}
	          			$menu .= "</ul>";
	          			$menu .= "</li>";	
        			}
	          	}
	          	
	          	$menu .= "</ul>";
	          	$menu .= '<span class="stretch"></span>';	
	         }
	         return $menu;
	}
	
	public function build_tabs_menu ($list_menu) { 
		// construire le html string du menu sous forme de tabs jquery ui
		// utiliser template php // ok dans le controller wkd_menu
		if (isset($list_menu)) {
	          	$tabs = '<div id="tabs" class="tabs_menu">';
          		$tabs .= '<ul id="tabs_index_list">';
  			$tabs .= '<li><a href="#tabs-racine">Racine</a></li>';
  			foreach ($list_menu as $data) {
  				if ($data['parent'] == 'racine') {
  					$tabs .= '<li><a href="#tabs-'.$data['alias_nom'].'">'.$data['alias_nom'].'</a></li>'; 
  					// alias_nom c'est l'intitulé de la catégorie
  				}
  			}
  			$tabs .= '</ul>';
  			$tabs .= '<div id="tabs-racine">';
			$tabs .= '<ul id="categories_list">';
  			foreach ($list_menu as $data) {
  				if ($data['parent'] == 'racine') {
  					$tabs .= '<li class="item_categorie">';
					$tabs .= anchor("wkd/show/".$data['alias_page'], $data['alias_nom']);
					$tabs .= '</li>';
  				}
  			}
  			$tabs .= '</ul>';
  			$tabs .= '</div>';
	          	foreach ($list_menu as $data) {
	          		if($data['parent'] == 'racine') {
	          			$tabs .= '<div id="tabs-'.$data['alias_nom'].'">';
	          			$tabs .= '<ul id="'.$data['alias_nom'].'_list">';
	          			foreach ($list_menu as $data1) {
	          				if($data1['parent'] == $data['alias_nom']) {	          		          								$tabs .= '<li class="item_submenu">';
	          					$tabs .= anchor("wkd/show/".$data1['alias_page'], $data1['alias_nom']);
	          					$tabs .= "</li>";
	          				}	          			
	          			}
	          			$tabs .= "</ul>";
	          			$tabs .= "</div>";	
        			}
	          	}
	          	$tabs .= "</div>";	
	         }
	         return $tabs;
	}
}
?>
