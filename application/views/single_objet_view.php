<div id="objet_<?=$objets_nom_page_sommaire;?>">
	<input type="hidden" value="<?=$objet_data['initial_index'];?>" name="objet_index_initial">
	<input type="hidden" value="<?=$objet_data['titre'];?>" name="objet_nom">
	<h1 class="objet_titre"><?=$objet_data['titre'];?></h1>
	<p id="objet_contenu_ckeditable" class="objet_contenu"><?=$objet_data['contenu'];?></p>
	<?php 
		if ($logged and !empty($objet_data['contenu'])) { ?>
	<div class="buttonset">
		<button id="bouton_edit_objet" value="Edit Object">Modifier la fiche</button>
	</div>
	<?php } ?>
</div>
