<?php

class Collection_objets extends CI_Controller {
	
	public function __construct () {
	
		parent::__construct();	
		$this->load->model('Users_model','', TRUE);
		$this->load->model('Collection_objets_model','', TRUE);
		$this->load->library('form_validation');
		$this->load->helper('date');
		$this->load->helper('text');
		$this->load->helper('html');
		$this->load->helper('regex_wikid');
	}
	
	private function _security_check_logged_in_or_exit () {
		if (!$this->Users_model->security_check_logged_in_or_die()) {
		exit;
		}
	}
	
	public function user_valide_collection_obj_sommaire () {
		$this->_security_check_logged_in_or_exit();
		
		$session_user_data = $this->Users_model->get_session_user_data();
		$current_user_id = $session_user_data['user_id'];
		$sommaire_collection_ul = $this->input->post('sommaire_collection');
		$collection_nom = $this->input->post('page_nom', true);
		//print_r($sommaire_collection); // ok
		$saved_sommaire_ul = $this->Collection_objets_model->user_save_collection_sommaire_ul($collection_nom, $sommaire_collection_ul, $current_user_id);
		echo json_encode($saved_sommaire_ul);
		
	}
	
	public function create_new_object ($collection_nom) {
		$this->_security_check_logged_in_or_exit();
	// save user's new object
		$session_user_data = $this->Users_model->get_session_user_data();
		$current_user_id = $session_user_data['user_id'];
		$new_obj_titre = $this->input->post('titre_new_object', true);
		$new_obj_titre = trim($new_obj_titre, ' ');
		$new_obj_url_index = url_kill_apostrophes(url_normalize_str(strtolower($new_obj_titre)));
		$bool_already_exists = $this->Collection_objets_model->bool_check_if_obj_url_index_already_exists($collection_nom, $new_obj_url_index);
		
		if (!$bool_already_exists) {
			$this->Collection_objets_model->add_new_object_to_collection($collection_nom, $new_obj_titre, $new_obj_url_index, $current_user_id);
		}
		
		$out['success'] = ($bool_already_exists) ? false : true;
		$out['new_obj_titre'] = $new_obj_titre;
		$out['new_obj_url_index'] = $new_obj_url_index;
		$out['collection_page_nom'] = $collection_nom;
		echo json_encode($out);
	}
	
	public function display_new_object_template ($nom_page_sommaire) {
	// nouvel objet on charge un formulaire pour demander le nom
		$this->_security_check_logged_in_or_exit();
		$data = array(
				'objets_nom_page_sommaire' => $nom_page_sommaire,
			);
			$this->load->view('new_object_view', $data);
	}
	
	public function display_objet ($nom_page_sommaire, $objet_titre = null) {
	// cas ou l'on demande un objet seulement'
		$logged = false;
		$logged = $this->Users_model->check_if_logged_in();
		if (isset($objet_titre)) {
			
		}
		$objet_array = $this->Collection_objets_model->get_object_from_collection($nom_page_sommaire, $objet_titre);
		if (!empty($objet_array)) {
			
			$objet_data = array(
				'objets_nom_page_sommaire' => $nom_page_sommaire,
				'objet_data' => $objet_array,
				'logged' => $logged
			);
			$objets['contenu'] = $this->load->view('single_objet_view', $objet_data, true);
			$out['objet_data'] = $objet_array;
			$out['success'] = true;
		}
		else {
	// le cas par défaut, on a pas demandé d'objet ni de catégorie mais cette page est une collection d'objet, on charge un conteneur objet vide
			$objet_data = array(
				'objets_nom_page_sommaire' => $nom_page_sommaire,
				'objet_data' => null,
				'logged' => false
			);
			$objets['contenu'] = $this->load->view('single_objet_view', $objet_data, true);
			//$out['objet_data'] = null;
			$out['success'] = false;
		}
		
		
		$out['page_nom'] = $nom_page_sommaire;
		$out['objet_contenu_html'] = $objets['contenu'];
		
		echo json_encode($out);
	}
	
	public function display_collection ($nom_page_collection) {
		$collection_array = $this->Collection_objets_model->get_collection($nom_page_collection);
		
		$a_attr = array(
			'class' => 'link_obj_collection',
			//'rel' => 'link'
		);
		foreach ($collection_array as $data) {
			$links_array[] = anchor("sync/show/".$data['page_nom']."/".$data['url_index'], $data['titre'], $a_attr);
		}
		$attributes = array(
                    'class' => 'collection_list',
                    'id'    => 'collection_'.$nom_page_collection.'_list'
                );

		echo ul($links_array, $attributes);
	}
	
	public function user_save_object () {
		$this->_security_check_logged_in_or_exit();
		
		$session_user_data = $this->Users_model->get_session_user_data();
		$current_user_id = $session_user_data['user_id'];
		$this->form_validation->set_rules('titre', 'Titre', 'trim|strip_tags|callback_is_only_whitespaces|required|xss_clean');
		$this->form_validation->set_rules('contenu', 'Contenu', 'trim|required');
		if($this->form_validation->run() == FALSE) {
			$out['validation_message'] = validation_errors();
			$out['validation_success'] = false;
		} else {
			$out['validation_message'] = 'object is OK';
			$out['validation_success'] = true;
			$contenu = $this->input->post('contenu');
			$init_index = $this->input->post('initial_index', true);
			$titre = $this->input->post('titre', true);
			$sommaire_page = $this->input->post('sommaire_page', true);
			//user_save_object ($collection_nom, $initial_index, $titre, $url_index, $contenu, $user_id)
			$titre = preg_replace('/&nbsp;|&amp;|\n/', '', $titre);
			//$titre = convert_accented_characters($titre);
			$url_index = url_kill_apostrophes(url_normalize_str(strtolower(convert_accented_characters(trim(strip_tags($titre))))));
			// replace characters other than letters, numbers by ''
       			$url_index = preg_replace('/([^_a-z0-9]+)/i', '', $url_index);
			//$url_index = preg_replace("[^A-Za-z0-9]", "", $titre);	
			$data = $this->Collection_objets_model->user_save_object($sommaire_page, $init_index, $titre, $url_index, $contenu, $current_user_id);
			$out = array_merge($out, $data);
		}
		 
		echo json_encode($out);

		//$saved_sommaire_ul = $this->Collection_objets_model->user_save_collection_sommaire_ul($collection_nom, $sommaire_collection_ul, $current_user_id);
	}
	
	public function is_only_whitespaces ($str) {
		$str = trim($str, '&nbsp;');
		if (preg_match('/^((?:&nbsp;|\s)+.*?)&nbsp;/', $str)) { // the string is only whitespace
			$this->form_validation->set_message('is_only_whitespaces', 'le titre ne peut être que des espaces blancs');
			return false;
		}
		else {
			return true;
		}
	}
	
	public function get_objects_from_every_collection () {
		$term = $this->input->get('term');
  		$list_menu = $this->Collection_objets_model->get_objects_from_every_collections_list($term);
  		if (!empty($list_menu)) {
  			foreach ($list_menu as $value) {
  				$out[] = $value['page_nom'].'/'.$value['url_index'];
  			}
  		}
  		echo json_encode($out);
	}
	
	/*
	
	public function edit_mode_init ($nom_page) {	
		//$this->Users_model->security_check_logged_in_or_die();	//pas intéressant le die s'execute seulement dans le model'
		$this->_security_check_logged_in_or_exit();
		// on pourrait vérifier si la dernière sauvegarde a été validée par l'utilisateur'
		//if ($this->Pages_model->check_if_user_validated('nom', $nom_page)) {// sinon charge le snapshot correspondant}
		$page_data = $this->Pages_model->get_page($nom_page);
		$data['page_nom'] = $page_data['nom'];
		$data['contenu'] = $page_data['contenu'];
		$data['tip'] = 'version validée';
		$page_user_data = $this->Users_model->get_user_data_by_id($page_data['user_id']);
		$data['page_user_login'] = $page_user_data['login'];
		$format_date = 'DATE_RSS';
		$data['human_date'] = standard_date($format_date, $page_data['date']);
		$data['bool_collection_objets'] = $page_data['bool_collection_objets'];
		$out = $this->load->view('edit_page_form_view', $data, TRUE);
		echo json_encode($out);
	}
	
	public function user_save_page () {
		$this->_security_check_logged_in_or_exit();
		
		$session_user_data = $this->Users_model->get_session_user_data();
		$current_user_id = $session_user_data['user_id'];
		//$this->input->post(null, true); // pour tout récupéerer d'un coup'
		$nom_page = $this->input->post('nom_page', true);
		$nouveau_contenu = $this->input->post('contenu_'.$nom_page);
		$bool_collection_objets = $this->input->post('collection_objets', true);
		
		// si la page existe : ne modifie pas le user si la page est identique.
		// pour indiquer si la page est le sommaire d'une collection objets on pourrait faire un model collection objets
		if ($this->Pages_model->check_if_already_exists('nom',$nom_page)) {
			$dernier_contenu = $this->Pages_model->get_page($nom_page); 
			if (($nouveau_contenu != $dernier_contenu['contenu']) or ($bool_collection_objets != $dernier_contenu['bool_collection_objets'])) {
				$saved_data = $this->Pages_model->user_save_page($nom_page, $nouveau_contenu, $bool_collection_objets, $current_user_id);
			}
			else {
				$saved_data['contenu'] = $dernier_contenu['contenu'];
			}
		}
		else {
		// si la page n'existe pas dans la table "pages" c'est une nouvelle page
			$saved_data = $this->Pages_model->user_save_page($nom_page, $nouveau_contenu, $bool_collection_objets, $current_user_id);
		}
		$out = $saved_data['contenu'];
		// give more feedback to users ? user and time etc.
		echo json_encode($out);
	}
	*/
}
	
