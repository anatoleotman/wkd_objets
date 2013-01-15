

CKEDITOR.plugins.add('wikid_link', {

	init: function (editor) {
		var iconPath = this.path + 'images/wikid_link.png';
		editor.addCommand('wikid_link_Dialog', new CKEDITOR.dialogCommand('wikid_link_Dialog'));
		editor.ui.addButton('wikid_link', {
			label: 'link WIKID',
			command: 'wikid_link_Dialog',
			icon: iconPath
		});
		if (editor.contextMenu) {

			editor.addMenuGroup('monGroupe');
			editor.addMenuItem('wikid_link_Item', {
				label : 'Edit Wikid Link',
				icon : iconPath,
				command : 'wikid_link_Dialog',
				group : 'monGroupe'
			});

			editor.contextMenu.addListener(function (element) {

				if (element) {element = element.getAscendant('a', true); }
				if (element && !element.isReadOnly() && !element.data('cke-realelement')) {return { 'wikid_link_Item' : 															CKEDITOR.TRISTATE_OFF }; }
				else return null;
			});
		}
		CKEDITOR.dialog.add('wikid_link_Dialog', function (editor) {
			var dialogDefinition = {
				title : 'wikid LINK',
				minWidth : 400,
				minHeight : 200,
				contents: [{ //pour les onglets
					id: 'tab0',
					label: 'reglages de base',
					elements: [//pour les champs à remplir
						{
							type : 'textarea',
							id : 'contenu_du_lien',
							label : 'Contenu du lien',
							//validate : CKEDITOR.dialog.validate.notEmpty('Fournir un contenu pour construire le lien'),
							setup: function (element) {
									this.setValue(element.getHtml());
							},
							commit : function (element) {
								element.setHtml(this.getValue());
							}
						},
						{
							type: 'select',
							id: 'type_de_lien',
							label: 'Lien de type',
							items: [
								['Page interne', 'page_interne'],
								['Page Exterieure', 'page_externe']
							],
							validate: CKEDITOR.dialog.validate.notEmpty('préciser le type de lien'),
							setup: function (element) {
								this.setValue(element.getAttribute('rel'));
							},
							commit: function (element) {
								element.setAttribute('rel', this.getValue());
							}

						},
						{
							type: 'text',
							id: 'lien_vers_page',
							label: 'URL interne ou externe',
							validate: CKEDITOR.dialog.validate.notEmpty('il faut donner un nom de page pour remplir le lien'),
							setup: function (element) {
								this.setValue(element.getAttribute('title'));
							},
							commit: function (element) {
								element.setAttribute('title', this.getValue());//value entered by user
							}
						}
					]
				}],
				onShow: function () {
					var sel = editor.getSelection();
					var element = sel.getStartElement();
					if (element) {
						element = element.getAscendant('a', true);
					}
					if (!element || element.getName() !== 'a' || element.data('cke-realelement')) {
						element = editor.document.createElement('a'); //dans onOK() on appellera cet element link
						element.setHtml(sel.getSelectedText());
						this.insertMode = true;
					} else {
						this.insertMode = false;
					}
					this.element = element;
					this.element.selected_text = sel.getSelectedText();
					//console.info(element);
					this.setupContent(this.element); //on passe l'élément pour initialiser les champs de la boite de dialogue'
				},
				buttons : [ CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton ],
				onOk: function () {
					var dialog = this;
					//var link = this.element; //été initialisé dans onShow()
					//console.info(this.element);
					this.commitContent(this.element);
					//console.info(this.element);
					if (this.element.getAttribute('rel') === 'page_interne') {
							//this.element.removeAttribute('href');
							this.element.setAttribute(
								'data-cke-saved-href',
								WIKIDGLOBALS.BASE_URL + 'index.php/wkd/show/' + this.element.getAttribute('title')
							);
							this.element.setAttribute(
								'href',
								WIKIDGLOBALS.BASE_URL + 'index.php/wkd/show/' + this.element.getAttribute('title')
							);
							this.element.setAttribute(
									'target',
									'_self'
							);
					} else if (this.element.getAttribute('rel') === 'page_externe')	{					
							//this.element.removeAttribute('href');
							this.element.setAttribute( 
								'data-cke-saved-href', 
								this.element.getAttribute('title')
							);
							this.element.setAttribute( 
								'data-cke-saved-href', 
								this.element.getAttribute('title')
							);
							this.element.setAttribute(
									'target',
									'_blank'
							);
					}
					if (this.insertMode) {
						editor.insertElement(this.element);
					}
					
					//link.setHtml(link.contenu); //voir dans setup element
					//editor.insertElement(link);
				}
			};
			return dialogDefinition;
		});
	}
});
