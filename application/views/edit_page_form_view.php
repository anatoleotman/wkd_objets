<form id="wikid_form_<?=$page_nom;?>" action= "<? echo base_url() . 'index.php/pages/user_save_page/' . $page_nom; ?>" method='POST' > 
	<textarea name="contenu_<?=$page_nom;?>"><?=$contenu;?></textarea>
	</br>
	<?php echo $tip. ' le ' . $human_date . ' par ' . $page_user_login;?> 
	</br>
	<button type="submit" name="save-<?=$page_nom;?>">
		Save <?=$page_nom;?>
   	</button>
	<button type="button" name="cancel-<?=$page_nom;?>">
		Cancel
	</button>
	</br>
	<input type="hidden" name="nom_page" value="<?=$page_nom;?>">
	<input type="checkbox" name="collection_objets" value="1" <?php if($bool_collection_objets == 1) echo 'checked'; ?>/> Collection d'objets </ br>
</form>
