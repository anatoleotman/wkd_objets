<?php

class Users_model extends CI_Model {
	
	function __construct () {
        // Call the Model constructor
        	parent::__construct();
        	session_start();
    	}
    	
    	function login_session_request ($user_infos) {
    		
    		$login_flag = false;
    		$user_login = $user_infos['user_login'];
    		$user_email = $user_infos['user_email'];
    		$user_password = md5($user_infos['user_password']);
    		
		$users_list = $this->db->from('users')->get();
		
		if ($users_list->num_rows() > 0) {	
			
			foreach ($users_list->result() as $row) {			
				if (
					($row->login == $user_login) and 
					($row->email == $user_email) and 
					($row->password == $user_password)
				) {
					$login_flag = true;
					$session_user_data = array(
						'user_id' => $row->id,
						'user_login' => $user_login,
						'user_email' => $user_email,
						'login_flag' => $login_flag
					);
					$this->session->set_userdata($session_user_data);
					$_SESSION['user_login'] = $user_login;					
					break;
				}
			}		
		}
		return $login_flag;
    	}
    	
    	function security_check_logged_in_or_die () {
    		$boolean = $this->session->userdata('login_flag');
    		if ($boolean) {return true;}
    		else {
    			print_r('37WKD37WKD37WKD37WKD37WKD37WKD37WKD37WKD37WKD37WKD37WKD37WKD37WKD37WKD_faille de securite');
    			return false;
    		//	die();	
    		//die ou exit, on sort de ce script php mais pas de celui du controlleur
    		}
    	}
    	
    	function check_if_logged_in () {
    		$boolean = $this->session->userdata('login_flag');
    		if ($boolean) {return true;}
    		else {
    			return false;
    		}
    	}  
    	
    	function get_current_user () {
    		return $this->session->userdata('user_login');
    	}
    	
    	function get_session_user_data () {
    		return $this->session->all_userdata();
    	}
    	function get_user_data_by_id ($user_id) {
    		$query = $this->db->from('users')->where('id', $user_id)->get();
		return $query->row_array();
    	}
    	
    		
}

