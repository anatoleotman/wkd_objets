
<div id="sommaire_collection_<?=$collection_id;?>" class="sommaire_collection">
	<ul><?=$collection_sommaire;?></ul>
</div>
<?php 
if ($logged) { ?>
<button id="bouton_sommaire_collection" value="Edit Sommaire">Modifier le sommaire</button>
<button id="bouton_new_object" value="Ajouter">Nouveau</button>

<?php } ?>
