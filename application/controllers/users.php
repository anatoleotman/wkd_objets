<?php

class Users extends CI_Controller {
	
	public function __construct() {
	
		parent::__construct();	
		$this->load->model('Users_model','', TRUE);
	}
	
	private function security_check_logged_in_or_exit () {
		if (!$this->Users_model->security_check_logged_in_or_die()) {
		exit;
		}
	}
	
	public function login_session_ajax () { //passer à la validation du formulaire
	
		$user_login = $this->input->post('login');
		$user_email = $this->input->post('email');
		$user_password = $this->input->post('password');
	
		$user_infos = array(
			'user_login' => $user_login,
			'user_email' => $user_email,
			'user_password' => $user_password
		);
		// si validation ok on fait la demande à la BDD
		$login_flag = $this->Users_model->login_session_request($user_infos);//infos stockées en session par le modèle		
		if($login_flag) {//si réponse de la base de donnees est OK
			//retour du formulaire ajax puis rechargement de la page avec les nouvelles infos de session
			$out['success'] = true; //on recharge la page avec js
			echo json_encode($out);
		}
		else {
			$out['success'] = false; //on gère la réaction de la boite de dialogue coté client
			echo json_encode($out);
		}	
	}
	
	public function logout () {
		$this->security_check_logged_in_or_exit();
		$this->session->sess_destroy();
		redirect('');
	}
	
	public function load_logo_wikid_layers () {
		echo $this->load->view('logo_wikid_layers_view', true);
	}
}
	
