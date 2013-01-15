<div id="objet_<?=$objets_nom_page_sommaire;?>">

	<form id="new_object_form" action= "<? echo base_url() . 'index.php/collection_objets/create_new_object/' . $objets_nom_page_sommaire; ?>" method='POST' >
	<br>
	<p id='new_object_tips'> choississez un titre à votre nouvel objet</p>
	</br>
	<input type="text" name="titre_new_object" value="">
	<button type="submit" name="save_new_object">
		Ajouter
   	</button>
	<button type="button" name="cancel_new_object">
		Annuler
	</button>
	</br>
	<input type="hidden" name="nom_collection" value="<?=$objets_nom_page_sommaire;?>">
</form>
</div>
