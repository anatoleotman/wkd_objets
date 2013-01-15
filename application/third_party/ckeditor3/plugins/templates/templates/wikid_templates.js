/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

// Register a templates definition set named "default".
CKEDITOR.addTemplates( 'wikid_templates',
{
	// The name of sub folder which hold the shortcut preview images of the
	// templates.
	imagesPath : CKEDITOR.getUrl( CKEDITOR.plugins.getPath( 'templates' ) + 'templates/images/' ),

	// The templates definitions.
	templates :
		[
			{
				title: 'Image and Title',
				image: 'template1.gif',
				description: 'One main image with a title and text that surround the image.',
				html:
					'<h3>' +
						'<img style="margin-right: 10px" height="100" width="100" align="left"/>' +
						'Type the title here'+
					'</h3>' +
					'<p>' +
						'Type the text here' +
					'</p>'
			},
			{
				title: 'Strange Template',
				image: 'template2.gif',
				description: 'A template that defines two colums, each one with a title, and some text.',
				html:
					'<table cellspacing="0" cellpadding="0" style="width:100%" border="0">' +
						'<tr>' +
							'<td style="width:50%">' +
								'<h3>Title 1</h3>' +
							'</td>' +
							'<td></td>' +
							'<td style="width:50%">' +
								'<h3>Title 2</h3>' +
							'</td>' +
						'</tr>' +
						'<tr>' +
							'<td>' +
								'Text 1' +
							'</td>' +
							'<td></td>' +
							'<td>' +
								'Text 2' +
							'</td>' +
						'</tr>' +
					'</table>' +
					'<p>' +
						'More text goes here.' +
					'</p>'
			},
			{
				title: 'Text and Table',
				image: 'template3.gif',
				description: 'A title with some text and a table.',
				html:
					'<div style="width: 80%">' +
						'<h3>' +
							'Title goes here' +
						'</h3>' +
						'<table style="width:150px;float: right" cellspacing="0" cellpadding="0" border="1">' +
							'<caption style="border:solid 1px black">' +
								'<strong>Table title</strong>' +
							'</caption>' +
							'</tr>' +
							'<tr>' +
								'<td>&nbsp;</td>' +
								'<td>&nbsp;</td>' +
								'<td>&nbsp;</td>' +
							'</tr>' +
							'<tr>' +
								'<td>&nbsp;</td>' +
								'<td>&nbsp;</td>' +
								'<td>&nbsp;</td>' +
							'</tr>' +
							'<tr>' +
								'<td>&nbsp;</td>' +
								'<td>&nbsp;</td>' +
								'<td>&nbsp;</td>' +
							'</tr>' +
						'</table>' +
						'<p>' +
							'Type the text here' +
						'</p>' +
					'</div>'
			},
			{
				title: 'Presentation Collection',
				description: 'Exemple de presentation des livres en ligne',
				html: '<table align="center" border="0" cellpadding="10" cellspacing="10" class="" style="width: 753px; height: 876px;">	<tbody>	<tr>	<td style="text-align: center; vertical-align: middle; height: 200px;">	<shadows>	<img alt="" src="" style="width: 180px; height: 282px; display: inline;" />	</shadows>	</td>	<td style="width: 160px;"><h1>Donne de coeur</h1>	<h2>Michel Ots</h2>	</td>	<td>	<p>	&nbsp;</p>	</td>	</tr>	<tr>	<td style="text-align: center; vertical-align: middle; height: 200px;">	<shadows><img alt="" src="" style="width: 180px; height: 228px; display: inline;" /></shadows></td>	<td>	<h1>	Sortir de l&#39;industrialisme</h1>		<h2>	Ouvrage Collectif</h2>	</td>	<td>	<p>	&nbsp;</p>	</td>	</tr>	<tr>	<td style="text-align: center; vertical-align: middle;">	<shadows><img alt="vide" src="ugug" style="width: 180px; height: 180px; display: inline;" /></shadows></td>	<td>	<h1>	La d&eacute;croissance ou le chaos</h1>	<p>	...</p>	</td>	<td>	&nbsp;</td>	</tr>	</tbody>	</table>'

			},
			{
				title: 'Presentation Livre',
				description: 'Exemple de présentation pour un livre seul',
				html: '<table border="0" cellpadding="10" cellspacing="10" class="table_translucide" style="height: 600px; width: 600px; "><tbody>	<tr>	<td rowspan="2" style="text-align: left; vertical-align: top; ">	<p>	<shadows><img alt="" src="" style="width: 268px;height: 420px; display: inline;" /></shadows></p>	<p>	Titre : Donne de coeur<br />	auteur : Michel Ots<br />	ISBN : 978-2-9538951-0-0<br />	Format : 11 x 18 cm<br />Nb pages : 80<br />	Prix : 9 euros<br />	&eacute;diteur : Le p&eacute;dalo ivre</p>	</td>	<td style="text-align: left; vertical-align: top;">	<h1>	Donne de coeur</h1>	<h2>	Michel Ots</h2>	<p style="text-align: justify; ">					Nathalie &eacute;l&egrave;ve des moutons. Elle vit en mobilehome. Rachid, Berndt, Agn&egrave;s logent dans un &eacute;difice baroque fait de paille, de planches, de pis&eacute;... Comme de nombreuses autres personnes vivant en habitat l&eacute;ger, ils sont menac&eacute;s par la loi LOPPSI 2 vot&eacute;e en d&eacute;cembre 2010.<br />	Entre fiction et r&eacute;flexion sur la loi, ce livre pr&eacute;sente une d&eacute;fense et une illustration de l&rsquo;habitat et la vie alternatifs.<br />	<br />	Michel Ots est notamment l&rsquo;auteur de Plaire aux vaches (Atelier du Gu&eacute;, 1994)</p>	<p style="text-align: justify;">	&nbsp;</p>	<p style="text-align: justify;">		&nbsp;</p>	<p style="text-align: justify;">	&nbsp;</p>	</td>	</tr>		<tr>	<td style="text-align: left; vertical-align: top;">&nbsp;</td>	</tr>	</tbody></table>'
			}
		]
});
