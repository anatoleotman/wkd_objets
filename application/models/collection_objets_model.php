<?php

class Collection_objets_model extends CI_Model {
	
	//private $ci;

	function __construct () {
        // Call the Model constructor
        	parent::__construct();
	       	$ci = get_instance();
		//$this->ci->load->model('Users_model','', TRUE);
		//$this->ci->mymodel->mymethod();
		// un model ne devrait pas en appeler un autre, 
		// c'est toutefois envisageable
		$ci->load->helper('url');
    	}
    	
    	function count_object_collection_entries ($collection_page_id) {
    		return $this->db->from('objets')->where('pages_id', $$collection_page_id)->count_all_results();
    	}
    	
    	function count_id_entries_in_table ($nom_table, $champ, $id) {
    		return $this->db->from($nom_table)->where($champ, $id)->count_all_results();
    	}
    	
	function get_page ($nom_page, $id = null) {
		if ($this->check_if_already_exists('nom',$nom_page)) {
			
			// si on ne précise pas l'id, on prend la page la plus récente.
			if (is_null($id)) {
				$query = $this->db->from('pages')->where('nom',$nom_page)->order_by('date', 'desc')->limit(1)->get();
				// prevoir si query est vide.
			}
			else {
				$array = array(
					'nom' => $nom_page,
					'id' => $id
				);
				$query = $this->db->from('pages')->where($array)->order_by('date', 'desc')->limit(1)->get();
				//prevoir un signal si le retour de cette requête est vide.
			}
	       		return $query->row_array();
		}		
    	}
#    	
#    	function get_object_from_collection ($collection_page_nom, $objet_url_index) {
#    		$where_options_array = array(
#    			'page_nom' => $collection_page_nom,
#    			'url_index' => $objet_url_index
#    		);
#    		$query = $this->db->from('objets')
#  				->where($where_options_array)
#  				->order_by('date', 'desc')
#  				->limit(1)
#  				->get();
#  		return $query->row_array();
#    	}
    	
    	function get_object_from_collection ($collection_page_nom, $objet_url_index) {
    		$initial_index_where_options_array = array(
    			'page_nom' => $collection_page_nom,
    			'url_index' => $objet_url_index
    		);
    		$initial_index_query = $this->db->from('objets')
  				->where($initial_index_where_options_array)
  				->order_by('date', 'desc')
  				->limit(1)
  				->select('initial_index')
  				->get();
  		$initial_index = $initial_index_query->row()->initial_index;
  		$last_index_where_options_array = array(
    			'page_nom' => $collection_page_nom,
    			'initial_index' => $initial_index
    		);
    		$last_index_query = $this->db->from('objets')
  				->where($last_index_where_options_array)
  				->order_by('date', 'desc')
  				->limit(1)
  				->get();
  		return $last_index_query->row_array();
  		
    	}
    	
    	
    	function bool_check_if_obj_url_index_already_exists ($collection_page_nom, $new_object_url_index) {
    		$where_options_array = array(
    			'page_nom' => $collection_page_nom,
    			'url_index' => $new_object_url_index
    		);
    		$query = $this->db->from('objets')
  				->where($where_options_array)
  				->get();
  		$result_array = $query->result_array();
  	// (condition) ? instruction si vrai : instruction si faux
  		$bool = (empty($result_array)) ? false : true;
  		return $bool;
    		
    	}
    	
    	function add_new_object_to_collection ($collection_nom, $new_object_titre, $new_object_url_index, $user_id) {
		$data = array(
			'page_nom' => $collection_nom,
			'initial_index' => $new_object_url_index,
			'url_index' => $new_object_url_index,
    			'titre' => $new_object_titre,
    			'contenu' => '(vide)',
    			'date' => time(),
               		'user_id' => $user_id
		);
		$this->db->insert('objets', $data); 
    	}
    	
    	function user_save_object ($collection_nom, $initial_index, $titre, $url_index, $contenu, $user_id) {
    		//page_nom 	initial_index 	titre 	url_index 	contexte 	contenu 	date 	user_id
    		$data = array(
			'page_nom' => $collection_nom,
			'initial_index' => $initial_index,
			'titre' => $titre,
			'url_index' => $url_index,
    			'contenu' => $contenu,
    			'date' => time(),
               		'user_id' => $user_id
		);
		$this->db->insert('objets', $data); 
		return $data;
    	}
    	
    	function get_collection_categorie ($collection_page_nom, $titre) {
    		$where_options_array = array(
    			'page_nom' => $collection_page_nom,
    			'categorie' => $titre
    		);
    		$query = $this->db->from('objets')
  				->where($where_options_array)
  				->order_by('date', 'desc')
  				->group_by('titre')
  				->get();
  		return $query->result_array();
    	}
    	
	function get_page_infos ($nom_page) {
			$query = $this
				->db
				->from('pages')
				->where('nom',$nom_page)
				->select('nom, bool_collection_objets, date')
				->order_by('date', 'desc')
				->limit(1)
				->get();
		
	}
    	
    	function get_collection ($nom_page) { 
    		$query = $this
    			->db
    			->from('objets')
    			->group_by('initial_index')
    			->where('page_nom', $nom_page)
    			->select('*')
    			->select_max('date')
    			->get();
    		return $query->result_array();
    	}
    	
    	function get_list_pages ($nom_page, $num, $offset) { // pour construire l'historique'
    		
    		$query = $this->db->where('nom', $nom_page)
    				->get('pages', $num, $offset);	
    		return $query->result_array();
  	}
  	
  	function get_collection_sommaire ($collection_page_nom) {
  		$query = $this->db->from('objets')
  				->where('page_nom', $collection_page_nom)
  				->order_by('date', 'desc')
  				->group_by('titre')
  				->get();
  		return $query->result_array();
  	}
  	
  	function get_collection_sommaire_ul ($collection_page_nom) {
  		$query = $this->db->from('objets_collections_sommaires')
  				->where('page_nom', $collection_page_nom)
  				->order_by('date', 'desc')
  				->limit(1)
  				->get();
  		return $query->row_array();
  	}
  	
  	function user_save_collection_sommaire_ul ($nom_page, $collection_sommaire_ul, $user_id) {
  		$data = array(
    			'id' => NULL,
    			'page_nom' => $nom_page,
               		'collection_sommaire_ul' => $collection_sommaire_ul,
               		'date' => time(),
               		'user_id' => $user_id
		);
		$this->db->insert('objets_collections_sommaires', $data);
		return $data;
  	}
  	
  	function get_collection_sommaire_array ($collection_page_nom) {
  		$query0 = $this->db->from('objets')
  				->where('page_nom', $collection_page_nom)
  				->select('categorie')
  				->distinct()
  				->get();
  		$out = array();
  		foreach ($query0->result_array() as $row0) {
  			$query1 = $this->db->from('objets')
	  				->where('page_nom', $collection_page_nom)
	  				->where('categorie', $row0['categorie'])
	  				//->select('titre')
	  				//->distinct()
	  				->group_by('titre')
	  				->order_by('date', 'desc')
	  				->get();
	  		foreach ($query1->result_array() as $value) { //$row0['categorie']
	  			$idx = anchor(
	  				'sync/show/'.$value['page_nom'].'/'.$row0['categorie'], $row0['categorie'], 
	  				array(
	  					'title' => $row0['categorie'],
	  					'class' => 'sommaire_collection'
	  				));
	  			$out[$idx][] = anchor(
	  				'sync/show/'.$value['page_nom'].'/'.$value['titre'], 
	  				$value['sommaire_alias'], 
	  				array(
	  					'title' => $value['contexte'], 
	  					'class' => 'sommaire_collection'
	  				));
	  		}
		}
		//print_r($out);
  		return $out;
  	}
  	
  	/*function get_collection_sommaire_parent ($collection_page_nom) {
  		$query0 = $this->db->from('objets')
  				->where('page_nom', $collection_page_nom)
  				->select('parent')
  				->distinct()
  				->get();
  		$out = array();
  		foreach ($query0->result_array() as $row0) {
  			$query1 = $this->db->from('objets')
	  				->where('page_nom', $collection_page_nom)
	  				->where('parent', $row0['parent'])
	  				->select('titre')
	  				->distinct()
	  				->order_by('date', 'desc')
	  				->get();
	  		$out[$row0['categorie']] = $query1->result_array();
		}
		//print_r($out);
  		return $out;
  	}
    */
    
	function check_if_already_exists ($field_selected, $entry) {
		return ($this->db->from('pages')->where($field_selected, $entry)->count_all_results())?TRUE:FALSE;
	}
		
	function user_save_page ($nom_page, $contenu, $bool_collection_objets, $user_id) {
		$data = array(
    			'id' => NULL,
    			'nom' => $nom_page,
               		'contenu' => $contenu,
               		'date' => time(),
               		'bool_collection_objets' => $bool_collection_objets,
               		'user_id' => $user_id
		);
		$this->db->insert('pages', $data);
		return $data;
	}
	
	function save_page ($nom_page, $contenu) { // avec new_page()
    		
    		$data = array(
    			'id' => NULL,
    			'nom' => $nom_page,
               		'contenu' => $contenu,
               		'date' => time(),
               		'user_id' => NULL,
               		'bool_collection_objets' => false
		);
		$this->db->insert('pages', $data);
		return $data;
	}
	
	function new_page ($nom_page) {
		$contenu_page_vierge = 'WIKID nouvelle page';
		$nouvelle_page = $this->save_page($nom_page, $contenu_page_vierge);
		return $nouvelle_page;
	}
	
	function get_objects_from_every_collections_list ($term) { 
    	// pour feed le autocomplete list lors de la creation d'un lien vers une fiche
    		
    		$tri = trim($term);	
    		if (!empty($tri)) {
    			$query = $this->db->query("
			SELECT objs1.*
			FROM objets objs1 LEFT JOIN objets objs2
			ON (objs1.initial_index= objs2.initial_index AND objs1.date < objs2.date)
			WHERE objs2.date IS NULL AND objs1.titre LIKE '%".$tri."%';"); 
    		}
    		else {
    			$query = $this->db->query("
			SELECT objs1.*
			FROM objets objs1 LEFT JOIN objets objs2
			ON (objs1.initial_index= objs2.initial_index AND objs1.date < objs2.date)
			WHERE objs2.date IS NULL; "); 
    		}
    		return $query->result_array();
    	}
}
