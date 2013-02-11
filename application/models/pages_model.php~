<?php

class Pages_model extends CI_Model {
	
	//private $ci;

	function __construct () {
        // Call the Model constructor
        	parent::__construct();
	       	//$this->ci =& get_instance();
		//$this->ci->load->model('Users_model','', TRUE); 
		// voir si logged in, c'est dans le model qui consulte la base de données'
		//$this->ci->mymodel->mymethod();  
    	}
    	
    	function count_page_entries ($nom_page) {
    		return $this->db->from('pages')
    				->where('nom',$nom_page)
    				->count_all_results();
    	}
    	
    	function count_id_entries_in_table ($nom_table, $champ, $id) {
    		return $this->db->from($nom_table)
    				->where($champ, $id)
    				->count_all_results();
    	}
    	
	function get_page ($nom_page, $id = null) {
		if ($this->check_if_already_exists('nom',$nom_page)) {
			
			// si on ne précise pas l'id, on prend la page la plus récente.
			if (is_null($id)) {
				$query = $this->db->from('pages')
						->where('nom',$nom_page)
						->order_by('date', 'desc')
						->limit(1)
						->get();
				// prevoir si query est vide.
			}
			else {
				$array = array(
					'nom' => $nom_page,
					'id' => $id
				);
				$query = $this->db->from('pages')
						->where($array)
						->order_by('date', 'desc')
						->limit(1)
						->get();
				//prevoir un signal si le retour de cette requête est vide.
			}
	       		return $query->row_array();
		}		
    	}
    	
	function get_page_infos($nom_page) {
			$query = $this
				->db
				->from('pages')
				->where('nom',$nom_page)
				->select('nom, bool_collection_objets, date')
				->order_by('date', 'desc')
				->limit(1)
				->get();
		
	}
    	
    	function get_list_noms_pages ($term) { 
    	// pour feed le autocomplete list lors de la creation d'un lien
    		$tri = trim($term);	
    		if (!empty($tri)) {
    			$query = $this->db->from('pages')
    				->select('nom')
    				->group_by('nom')
    				->like('nom', $tri)
    				->get();
    		}
    		else {
    			$query = $this->db->from('pages')
    				->select('nom')
    				->group_by('nom')
    				->get();
    		}
    		return $query->result_array();
    	}
    	
    	function get_list_pages ($nom_page, $num, $offset) { 
    		// pour construire l'historique'
    		$query = $this->db->where('nom', $nom_page)->get('pages', $num, $offset);	
    		return $query->result_array();
  	}
    
	function check_if_already_exists ($field_selected, $entry) {
		return ($this->db->from('pages')->where($field_selected, $entry)->count_all_results()) ? TRUE : FALSE;
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
	
	function user_new_page ($nom_page, $user_id) {
		$contenu_page_vierge = 'WIKID nouvelle page:: '.$nom_page;
		$nouvelle_page = $this->user_save_page($nom_page, $contenu_page_vierge, false, $user_id);
		return $nouvelle_page;
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
	
	function get_sommaire_collection_objets ($nom_page) {
		// ul list serialized
		$query = $this
				->db
				->from('pages')
				->where('nom',$nom_page)
				->select('sommaire_collection_objets')
				->order_by('date', 'desc')
				->limit(1)
				->get();	
    		return $query->row_array();
	}
	
	function user_save_collection_sommaire ($nom_page, $sommaire_collection_ul) {
	
	}
}
