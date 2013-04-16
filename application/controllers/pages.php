<?php

class Pages extends CI_Controller {
	
	public function __construct () {
	
		parent::__construct();	
		$this->load->model('Pages_model','', TRUE);
		$this->load->model('Users_model','', TRUE);
		$this->load->model('Collection_objets_model','', TRUE);
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
	
	public function display_ajax ($nom_page, $objet_nom = null) {
		// charger les boutons edit si logged in
		$logged = false;
		$logged = $this->Users_model->check_if_logged_in();
		
		$page = $this->Pages_model->get_page($nom_page);
		if (isset($page)) {
			$page = wikid_config_search_replace($page, $this);
			$data_contenu_ckeditable_view = array(
				'data' => $page['contenu'],
				'page_nom' => $page['nom']
			);
			$page['contenu'] = $this->load->view('contenu_ckeditable_view', $data_contenu_ckeditable_view, true);
			
		// la pages est elle une collection d'objets'
			if (((boolean) $page['bool_collection_objets'])) {
				$sommaire_collection_objets_serialized = $this->Collection_objets_model->get_collection_sommaire_ul($page['nom']);
			// si le sommaire n'existe pas, c'est une nouvelle collection d'objets'	
				$sommaire_collection_objets = (!empty($sommaire_collection_objets_serialized)) ? $sommaire_collection_objets_serialized['collection_sommaire_ul'] : null;
				$data_sommmaire_collection_objets_view = array(
						'collection_id' => $page['nom'],
						'collection_sommaire' => $sommaire_collection_objets,
						'logged' => $logged
				);
				$page['contenu'] .= $this->load->view('sommmaire_collection_objets_view', $data_sommmaire_collection_objets_view, true);
			
				if (isset($objet_nom)) {
					$objet_array = $this->Collection_objets_model->get_object_from_collection($page['nom'], $objet_nom);
						// si objet existe
						if(!empty($objet_array)) {
							$objet_data = array(
								'objets_nom_page_sommaire' => $page['nom'],
								'objet_data' => $objet_array
								);
								$objet_view = $this->load->view('single_objet_view', $objet_data, true);
								$page['contenu'] .= $objet_view;
								$out['objet_data'] = $objet_array;		
						}
						// si objet nexiste pas
						else {
							$objet_data = array(
							'objets_nom_page_sommaire' => $page['nom'],
							'objet_data' => null,
							'titre' => null
							);
							$objet_view = $this->load->view('single_objet_view', $objet_data, true);
							$page['contenu'] .= $objet_view;
						
					}
				}
				else {
				// le cas par défaut, on a pas demandé d'objet ni de catégorie mais cette page est une collection d'objet, on charge un conteneur objet vide
					$objet_data = array(
						'objets_nom_page_sommaire' => $page['nom'],
						'objet_data' => null,
						'titre' => null
					);
					$objet_view = $this->load->view('single_objet_view', $objet_data, true);
					$page['contenu'] .= $objet_view;
				}
				
			}
			$out['success'] = true;
			$out['page_nom'] = $page['nom'];
			$out['page_contenu'] = $page['contenu'];
			echo json_encode($out);
		}
		
		if(!isset($page) and $this->Users_model->check_if_logged_in()) {
			$this->_security_check_logged_in_or_exit();
			$page = $this->Pages_model->new_page($nom_page);
			$out['coordonnees'] = $this->Pages_model->new_coordinates($nom_page);//essayer voir si initialisation coté modèle fonctionne
			$out['success'] = true;
			$out['page_nom'] = $page['nom'];
			$out['page_contenu'] = $page['contenu'];
			echo json_encode($out);
		}
		
	}
	
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
	
	public function edit_mode_inline_init ($nom_page) {	
		//$this->Users_model->security_check_logged_in_or_die();	//pas intéressant le die s'execute seulement dans le model'
		$this->_security_check_logged_in_or_exit();
		// on pourrait vérifier si la dernière sauvegarde a été validée par l'utilisateur'
		//if ($this->Pages_model->check_if_user_validated('nom', $nom_page)) {// sinon charge le snapshot correspondant}
		$page_data = $this->Pages_model->get_page($nom_page);
		$data['page_nom'] = $page_data['nom'];
		//$data['contenu'] = $page_data['contenu'];
		
		$data['tip'] = 'version validée';
		$page_user_data = $this->Users_model->get_user_data_by_id($page_data['user_id']);
		$data['page_user_login'] = $page_user_data['login'];
		$format_date = 'DATE_RSS';
		$data['human_date'] = standard_date($format_date, $page_data['date']);
		$data['bool_collection_objets'] = $page_data['bool_collection_objets'];
		
		$out['contenu'] = $page_data['contenu'];
		$out['options'] = $this->load->view('edit_page_options_view', $data, TRUE);
		echo json_encode($out);
	}
	/*
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
	
	public function user_save_page_contenu () { // avec ckeditor inline mode
		$this->_security_check_logged_in_or_exit();
		
		$session_user_data = $this->Users_model->get_session_user_data();
		$current_user_id = $session_user_data['user_id'];
		//$this->input->post(null, true); // pour tout récupéerer d'un coup'
		$nom_page = $this->input->post('nom_page', true);
		$nouveau_contenu = $this->input->post('contenu');
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
	
	public function display_new_page_form () {
		// nouvelle page on charge un formulaire pour demander le nom
		$this->_security_check_logged_in_or_exit();
		$this->load->view('nouvelle_page_view');
	}
	
	public function create_new_page () {
		$this->_security_check_logged_in_or_exit();
	// save user's new object
		$session_user_data = $this->Users_model->get_session_user_data();
		$current_user_id = $session_user_data['user_id'];
		$new_page_titre = $this->input->post('titre_new_page', true);
		$new_page_titre = trim($new_page_titre, ' ');
		$new_page_url_index = url_kill_apostrophes(url_normalize_str(strtolower(convert_accented_characters($new_page_titre))));
		// replace characters other than letters, numbers by ''
       		$new_page_url_index = preg_replace('/([^_a-z0-9]+)/i', '', $new_page_url_index);
		$bool_already_exists = $this->Pages_model->check_if_already_exists('nom', $new_page_url_index);
		
		if (!$bool_already_exists) {
			$this->Pages_model->user_new_page($new_page_url_index, $current_user_id);
		}
		
		$out['success'] = ($bool_already_exists) ? false : true;
		$out['new_page_titre'] = $new_page_titre;
		$out['new_page_url_index'] = $new_page_url_index;
		echo json_encode($out);
	}
	
}
	
