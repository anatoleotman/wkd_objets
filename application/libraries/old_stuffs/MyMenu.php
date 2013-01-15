<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
// ici je regroupe les fonctions pour construire du html coté serveur

	class Build_Html_Menu{
	
	private $ci;
	
	public function __construct($params) {
        // Do something with $params
        $this->list_menu = $params;
        $this->$ci =& get_instance();
        $this->$ci->load->helper('url');
    	}
	
	public function show_menu(){ // construit du html :une simple liste imbriquée pour le menu en mode no javascript
	          //$obj =& get_instance();
	          //print_r($this->list_menu);
	          if(isset($this->list_menu)) {
	          	$menu ='<ul id="menu_liste" class="menu_liste">';
	          	foreach ($this->list_menu as $data) {
	          		if($data['parent'] == 'racine') {
	          			$menu .= '<li class="categorie">';
	          			$menu .= anchor("wkd/show/".$data['alias_page'],$data['alias_nom']);
	          			$menu .= '<ul class="submenu">';	       		
	          			foreach ($this->list_menu as $data1) {
	          				if($data1['parent'] == $data['alias_nom']) {	          		          								$menu .= '<li class="submenu_item">';
	          					$menu .= anchor("wkd/show/".$data1['alias_page'],$data1['alias_nom']);
	          					$menu .= "</li>";
	          				}	          			
	          			}
	          			$menu .= "</ul>";
	          			$menu .= "</li>";	
        			}
	          	}
	          	$menu .= "</ul>";	
	          }
	         //$obj->load->helper('url');//pas certain que ce soit autoloaded
	         return $menu;
	   }
	}
?>
