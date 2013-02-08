
<div id="sommaire_collection_<?=$collection_id;?>" class="sommaire_collection">
	<ul id="sommaire_collection_ul" class="accordion"><?=$collection_sommaire;?>
	</ul>
</div>
<?php 
if ($logged) { ?>
<div id="buttonset_sommaire_collection" class="buttonset"><button id="bouton_sommaire_collection" value="Edit Sommaire">Modifier  sommaire</button></div>
<?php } ?>
