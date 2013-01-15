<?php
    
	
	    /*
	    Copyright 2008, 2009, 2010, 2011 Patrik Hultgren
	    
	    YOUR PROJECT MUST ALSO BE OPEN SOURCE IN ORDER TO USE THIS VERSION OF PHP IMAGE EDITOR.
	    BUT YOU CAN USE PHP IMAGE EDITOR JOOMLA PRO IF YOUR CODE NOT IS OPEN SOURCE.
	    
	    This file is part of PHP Image Editor Joomla.
	
	    PHP Image Editor Joomla is free software: you can redistribute it and/or modify
	    it under the terms of the GNU General Public License as published by
	    the Free Software Foundation, either version 3 of the License, or
	    (at your option) any later version.
	
	    PHP Image Editor Joomla is distributed in the hope that it will be useful,
	    but WITHOUT ANY WARRANTY; without even the implied warranty of
	    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	    GNU General Public License for more details.
	
	    You should have received a copy of the GNU General Public License
	    along with PHP Image Editor Joomla. If not, see <http://www.gnu.org/licenses/>.
	    */
	
	if (!defined("PIE_IMAGE_MAX_WIDTH"))
	{
	    define("PIE_IMAGE_MAX_WIDTH", 900);
		define("PIE_IMAGE_MAX_HEIGHT", 1400);
		define("PIE_DEFAULT_LANGUAGE", "en-GB");
		define("PIE_RELOAD_PARENT_BROWSER_ON_SAVE", true);
		define("PIE_AJAX_POST_TIMEOUT_MS", 20000);
	
		//Set to false if you wan´t to remove the PHP Image Editor footer link from your site.
		//I´m really thankful if you wan´t to keep it.
		//Because it helps me to spread PHP Image Editor.
		define("PIE_FOOTER_LINK_ENABLED", false);
		
		define("PIE_RESIZE_ENABLED", true);
		define("PIE_ROTATE_ENABLED", true);
		define("PIE_CROP_ENABLED", true);
		define("PIE_EFFECTS_ENABLED", true);
		
		/*	
			PIE_START_PANEL can have any of these values.
			The panel must be enabled which is set above.
			
			PIE_MENU_RESIZE
			PIE_MENU_ROTATE
			PIE_MENU_CROP
			PIE_MENU_EFFECTS
		*/
		define("PIE_START_PANEL", PIE_MENU_RESIZE);
	}
	
?>