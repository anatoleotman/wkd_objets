<form id="nouvelle_page_form" action= "index.php/pages/create_new_page/" method='POST' >
	<fieldset>
	<legend>Nouvelle page</legend>
	<br>
	<p id='new_object_tips'> choississez un titre à votre nouvelle page</p>
	</br>
	<input type="text" name="titre_new_page" value="" class="required">
	<span class='buttonset'>
	<button type="submit" name="save_new_page">
		Ajouter page</button><button type="button" name="cancel_new_page">
		Annuler
	</button></span>
	</br>
	</fieldset>
</form>
