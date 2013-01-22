<?php

class Sync extends CI_Controller {
	
	public function __construct () {
	
		parent::__construct();
		
		$this->load->model('Pages_model','', TRUE);
		$this->load->model('Menu_model','', TRUE);
		$this->load->model('Users_model','', TRUE);
		$this->load->model('Collection_objets_model','', TRUE);
		
		$this->load->helper('regex_wikid');
		$this->load->helper('html');
			
		$this->load->library('Build_html_menu'); // custom library :: loosely coupled // models:: tightly coupled
		$this->load->library('user_agent');
		$this->load->library('table');
	}	
	
	private function _browser_detect () {
		//$this->load->library('user_agent');

		if ($this->agent->is_browser()) {
			$agent = $this->agent->browser().' '.$this->agent->version();
		}
		elseif ($this->agent->is_robot()) {
			$agent = $this->agent->robot();
		}
		elseif ($this->agent->is_mobile()) {
			$agent = $this->agent->mobile();
		}
		else {
			$agent = 'Unidentified User Agent';
		}
		//echo $agent;
		$data =  array(	'agent' => $agent, 
				'platform' => $this->agent->platform()
		);
		//$this->load->view('browser_version_warning_view', $data);
	}
	
	public function index () {
		$this->show('accueil');
	}
	
	public function show ($nom_page, $objet_nom = null) {
		// données envoyées lors d'un chargement 'synchrone' d'une page
		
		$page = $this->Pages_model->get_page($nom_page); // la page la plus récente
		$page = wikid_config_search_replace($page, $this);
		$entete = $this->Pages_model->get_page('header');
		$pied_page = $this->Pages_model->get_page('footer');
		
		$list_menu = $this->Menu_model->get_list_menu();
		
		$logged = false;
		$logged = $this->Users_model->check_if_logged_in();
		
		if (isset($list_menu)) {
			$my_menu = new Build_html_menu();
			$menu = $my_menu->show_menu($list_menu);
		}
		
		
		if (((boolean) $page['bool_collection_objets'])) {
		
			// on a demandé une page qui est bien une collection d'objets'
			// charger le sommaire
			$sommaire_collection_objets = $this->Collection_objets_model->get_collection_sommaire_ul($page['nom']);
			//print_r()
			$data_sommmaire_collection_objets_view = array(
				'collection_id' => $page['nom'],
				'collection_sommaire' => $sommaire_collection_objets['collection_sommaire_ul'],
				'logged' => $logged
			);
			$page['contenu'] .= $this->load->view('sommmaire_collection_objets_view', $data_sommmaire_collection_objets_view, true);
			
			if (isset($objet_nom)) {
				$objet_array = $this->Collection_objets_model->get_object_from_collection($page['nom'], $objet_nom);
				if(!empty($objet_array)) {
					$objet_array = $this->Collection_objets_model->get_object_from_collection($page['nom'], $objet_nom);
					$objet_data = array(
						'objets_nom_page_sommaire' => $page['nom'],
						'objet_data' => $objet_array
						);
						$objet_view = $this->load->view('single_objet_view', $objet_data, true);
						$out['objet_data'] = $objet_array;		
				}
			}
			else { 
			// le cas par défaut, on a pas demandé d'objet ni de catégorie mais cette page est une collection d'objet, on charge un conteneur objet vide
				$objet_data = array(
					'objets_nom_page_sommaire' => $page['nom'],
					'objet_data' => null,
				);
				$objet_view = $this->load->view('single_objet_view', $objet_data, true);
			}
			$page['contenu'] .= $objet_view;
		}
		
		$main_view_data = array(
				'page' => $page, 
				'entete' => $entete, 
				'pied_page' => $pied_page,
				'menu' => $menu,
				'base_url' => base_url(),
				'logged' => $logged
		);
		
		//$this->_browser_detect();
		$this->load->view('main_view', $main_view_data);
		
	}
	
	public function history ($nom_page) {
		
    		// load pagination class
   		$this->load->library('pagination');
    		$config['base_url'] = base_url().'index.php/wkd/history/'.$nom_page.'/';
    		$config['total_rows'] = $this->Pages_model->count_page_entries($nom_page);
    		$config['per_page'] = '5';
    		$config['num_links'] = 2;
    		$config['full_tag_open'] = '<p>';
    		$config['full_tag_close'] = '</p>';
    		$config['uri_segment'] = 4;
    		$config['display_pages'] = FALSE; 
    		$this->pagination->initialize($config);
		
    		//load the model and get results
    		$data['results'] = $this->Pages_model->get_list_pages($nom_page, $config['per_page'], $this->uri->segment(4));
		$data['nom'] = $nom_page;
		//print_r($data['results']);
    		// load the HTML Table Class
    		$this->load->library('table'); //autoloaded
    		$this->table->set_heading('ID', 'NOM_PAGE', 'CONTENU', 'DATE');
    		foreach ($data['results'] as $page) { //affiche une ligne pour chaque page de l'historique.
			// Build the custom actions links.
			$action_show = anchor('wkd/show/'.$page['nom'].'/'.$page['id'], 'Show', array('title' => 'Aperçu de la page'));
			$action_edit = anchor('wkd/edit/'.$page['nom'].'/'.$page['id'], 'Edit', array('title' => 'Recharger ancienne page'));
			// Adding a new table row.
			  $this->table->add_row($page['id'], 
						$page['nom'], 
						$page['contenu'], 
						$page['date'], 
						$action_show,
						$action_edit);
		}
		$this->load->view('page_history_view', $data);
  	}
}
	
