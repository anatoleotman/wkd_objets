<?php

class Menu extends CI_Controller {
	
	public function __construct () {
	
		parent::__construct ();	
		$this->load->model('Menu_model','', TRUE);
		$this->load->model('Pages_model','', TRUE);
		$this->load->model('Users_model','', TRUE);
		$this->load->helper('regex_wikid');
		$this->load->helper('url');
		$this->load->helper('file');
		$this->load->helper('html');
		$this->load->library('Build_html_menu');
		$this->load->library('parser');		
	}
	
	private function security_check_logged_in_or_exit () {
	
		if (!$this->Users_model->security_check_logged_in_or_die()) {
			exit;
		}
	}
	
	public function init_jstree () {
		// initilise avec de la donnée jstree
  		$serialized_tree_menu = $this->Menu_model->get_json_menu(); 
  		//print_r($serialized_tree_menu);
  		$out = unserialize($serialized_tree_menu['tableau_menu']);
		echo json_encode($out);
  	}
	
	public function get_menu () {
		// pour afficher le menu en html
  		$list_menu = $this->Menu_model->get_list_menu();
  		
		if (isset($list_menu)) {
			//$this->load->library('Build_html_menu', $list_menu);
			$my_menu = new Build_html_menu();
			$out['liste'] = $my_menu->show_menu($list_menu);
			echo json_encode($out);
		}
	}
	
	public function get_menu_tabs_template () {
		// pour afficher les tabs en html
		// utilise un template parser
  		$list_menu = $this->Menu_model->get_list_menu();
		if (isset($list_menu)) {
		
			$infos['tabs_index_list'][] = array(
			'index_categorie' => 0,
			'categorie' => 'racine');
			$index_j = 1;
			foreach ($list_menu as $data) {
  				if ($data['parent'] == 'racine') {
  					$infos['tabs_index_list'][] = array(
  						'index_categorie' => $index_j,
  						'categorie' => $data['alias_nom']
  						// alias_nom c'est l'intitulé de la catégorie
  					);
  					$index_j += 1;	
  				}
  			}
  			$index_i = 1;
  			$infos['tabs'][0]['index_categorie'] = 0;
  			$infos['tabs'][0]['categorie'] = 'racine';
  			foreach ($list_menu as $data) {
  				if ($data['parent'] == 'racine') {
  					$infos['tabs'][0]['list_categorie'][] = array(
  						'anchor' => anchor("wkd/show/".$data['alias_page'], $data['alias_nom'])
  						//'anchor' => base_url().'#'.$data['alias_page']
  					);
  					$infos['tabs'][$index_i]['index_categorie'] = $index_i;
  					$infos['tabs'][$index_i]['categorie'] = $data['alias_nom'];
  					foreach ($list_menu as $data1) {
  						if ($data1['parent'] == $data['alias_nom']) {
  							$infos['tabs'][$index_i]['list_categorie'][] = array(
  								'anchor' => anchor("wkd/show/".$data1['alias_page'], $data1['alias_nom'])
  								//'anchor' => base_url().'#'.$data['alias_page']
  							);	
  						}
  					}
  					$index_i = $index_i + 1;
  				}
  			}
  			// appel du template parser
			$out['tabs'] = $this->parser->parse('menu_wikid_tabs_categorie_template', $infos, TRUE);
			$out['fileupload_form'] = $this->load->view('upload_view', '', true);
			echo json_encode($out);
		}
	}
  	
  	public function get_pages_list () {
  		// pour le plugin autocomplete
  		$list_menu = $this->Pages_model->get_list_noms_pages();
  		foreach ($list_menu as $value) {
  			$out[] = $value['nom'];
  		}
  		echo json_encode($out);
	}
	
	public function save_menu () {
		//ajax save jstree menu
		$this->security_check_logged_in_or_exit();  	
  	
  		$nouveau_menu = $this->input->post('menu');
  		//print_r($nouveau_menu);
  		$serialized_nouveau_menu = serialize($nouveau_menu);
  		//print_r($serialized_nouveau_menu);
  		$this->Menu_model->save_json_menu($serialized_nouveau_menu);
  		// empty menu_json table and save entire serialized json tree
  		// parcours le tableau reçu 
  		$this->Menu_model->empty_menu();
		foreach ($nouveau_menu as $value) {
   			$categorie_nom = $value['data']['title']; // voir appliquer regex
   			$categorie_nom_page = explode("/", $categorie_nom); // titre en premier puis lien après le slash
   			$categorie_href = $value['data']['attr']['href'];
   			//$categorie_lien = ltrim($categorie_href, "#"); // lien après le diese
   			$categorie_lien = preg_replace('/^#/', '', $categorie_href); 
   			if (!isset($categorie_lien) || $categorie_lien == null) {
   				$categorie_lien = "lien vide";	
   			}
   			$categorie_parent = 'racine';
   			$this->Menu_model->save_menu_entry($categorie_nom_page[0], $categorie_lien, $categorie_parent);
   			if(isset($value['children'])){
   				foreach ($value['children'] as $value1) {
   					$alias_nom = $value1['data']['title'];
   					$alias_nom_page = explode("/", $alias_nom);
   					$alias_href = $value1['data']['attr']['href'];
   					//$alias_lien = ltrim($alias_href, "#");
   					$alias_lien = preg_replace('/^#/', '', $alias_href); 
   					if (!isset($alias_lien) || $alias_lien == null) {
   						$alias_lien = "lien vide";	
   					}
   					$alias_parent = $categorie_nom_page[0];
   					$this->Menu_model->save_menu_entry($alias_nom_page[0], $alias_lien, $alias_parent);
   				}
   			}
		}
  		$out['informations_serveur_menu'] = $nouveau_menu;
  		$out['success'] = TRUE;
  		
  		$list_menu = $this->Menu_model->get_list_menu();
		//print_r($list_menu);
		if (isset($list_menu)) {
			$my_menu = new Build_html_menu();
			$out['success'] = true;
			$out['menu'] = $my_menu->show_menu($list_menu);
			$out['list'] = ul($nouveau_menu);
		}
  		
		echo json_encode($out);
  	}
  	
  	public function get_thumbnails () {
  		$filesnames = get_filenames('./upload/img/thumbnails/');
  		foreach ($filesnames as $value) {
  			$image_properties = array(
				'src' => 'upload/img/thumbnails/'.$value,
				'class' => 'thumbnail_mini',
				//'width' => '200',
				//'height' => '200',
				'title' => $value,
				'rel' => 'lightbox',
			);
  			$images_list[] = img($image_properties);
  		}
  		$attributes = array(
			'class' => 'thumbnails_mosaic',
			'id'    => 'thumbnails_list_mosaic'
		);
		$out = ol($images_list, $attributes);
	  		//print_r(base_url().'upload/img/thumbnails/');
  		echo json_encode($out);
  	}
}
