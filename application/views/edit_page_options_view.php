<div id="edit_mode_options_<?=$page_nom;?>" class="edit_mode_options" action= "<? echo base_url() . 'index.php/pages/user_save_page_contenu/' . $page_nom; ?>" method='POST' > 
	</br>
	<?php echo $tip. ' le ' . $human_date . ' par ' . $page_user_login;?> 
	</br>
	<span class="edit_mode_options_buttonset">
		<button type="submit" name="save-<?=$page_nom;?>">Save <?=$page_nom;?></button><button type="button" name="cancel-<?=$page_nom;?>">Cancel</button>
	</span>
	</br>
	<input type="hidden" name="nom_page" value="<?=$page_nom;?>">
	<input type="checkbox" name="collection_objets" <?php if($bool_collection_objets == 1) echo 'checked'; ?>/> Collection d'objets </ br>
</div>
