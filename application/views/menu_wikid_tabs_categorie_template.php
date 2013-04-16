<div id="tabs" class="tabs_menu">
	<ul id="tabs_index_list">
	
	{tabs_index_list}
		<li><a href="#tabs-{index_categorie}">{categorie}</a></li>
	{/tabs_index_list}
	
	</ul>
	
	{tabs}
		<div id="tabs-{index_categorie}">
			<ul id="{categorie}_list" class="tab_content">
				{list_categorie}
					<li>{anchor}</li>
				{/list_categorie}
			</ul>
		</div>
	{/tabs}
</div>
