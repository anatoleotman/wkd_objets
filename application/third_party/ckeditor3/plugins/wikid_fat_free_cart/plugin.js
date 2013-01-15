

CKEDITOR.plugins.add('wikid_fat_free_cart', {

	init: function (editor) {
		var this_path = this.path;
		var iconPath = this.path + 'images/cart.png';
		editor.addCommand('wikid_fat_free_cart_Dialog', new CKEDITOR.dialogCommand('wikid_fat_free_cart_Dialog'));
		editor.ui.addButton('wikid_fat_free_cart', {
			label: 'Boutique : Ajouter un article',
			command: 'wikid_fat_free_cart_Dialog',
			icon: iconPath
		});
		if (editor.contextMenu) {

			editor.addMenuGroup('monGroupe');
			editor.addMenuItem('wikid_fat_free_cart_Item', {
				label : 'Modifier article',
				icon : iconPath,
				command : 'wikid_fat_free_cart_Dialog',
				group : 'monGroupe'
			});

			editor.contextMenu.addListener(function (element) {

				if (element) {element = element.getAscendant('fat_free_cart', true); }
				if (element && !element.isReadOnly() && !element.data('cke-realelement')) {return { 'wikid_fat_free_cart_Item' : 															CKEDITOR.TRISTATE_OFF }; }
				else return null;
			});
		}
		CKEDITOR.dialog.add('wikid_fat_free_cart_Dialog', function (editor) {
			var dialogDefinition = {
				title : 'Ajouter un article',
				minWidth : 400,
				minHeight : 200,
				width: 420,
				height: 430,
				contents: [{ //pour les onglets
					id: 'tab0',
					label: 'bouton fat free cart',
					elements: [//pour les champs à remplir
						{
							type : 'text',
							id : 'nom_article',
							label : 'Nom article',
							validate : CKEDITOR.dialog.validate.notEmpty('Fournir le nom d un article'),
							setup: function (element) {
								console.info(element);
									var i = element.getItem(3);
									//i = editor.restoreRealElement(i);
									this.setValue(i.getAttribute('value'));
							},
							commit : function (element) {
								var i = element.getItem(3);
								console.info(i);
								i.setAttribute('value', this.getValue());
							}
						},
						{
							type : 'text',
							id : 'numero_article',
							label : 'Numero article',
							//validate : CKEDITOR.dialog.validate.notEmpty('Fournir le numero de l article'),
							setup: function (element) {
									var i = element.getItem(4);
									this.setValue(i.getAttribute('value'));
							},
							commit : function (element) {
								var i = element.getItem(4);
								i.setAttribute('value', this.getValue());
							}
						},
						{
							type: 'text',
							id: 'prix_article',
							label: 'Prix unitaire',
							//validate: CKEDITOR.dialog.validate.notEmpty('il faut donner le prix de l article'),
							setup: function (element) {
								var i = element.getItem(5);
								this.setValue(i.getAttribute('value'));
							},
							commit: function (element) {
								var i = element.getItem(5);
								i.setAttribute('value', this.getValue());
							}
						
						},
						{
							type : 'text',
							id : 'quantite',
							label : 'Quantite',
							//validate : CKEDITOR.dialog.validate.notEmpty('Fournir le nombre d articles'),
							setup: function (element) {
									var i = element.getItem(6);
									this.setValue(i.getAttribute('value'));
							},
							commit : function (element) {
								var i = element.getItem(6);
								i.setAttribute('value', this.getValue());
							}
						},
						{
							type : 'text',
							id : 'shipping',
							label : 'Frais de livraison',
							//validate : CKEDITOR.dialog.validate.notEmpty('Indiquer les frais de livraison'),
							setup: function (element) {
									var i = element.getItem(7);
									this.setValue(i.getAttribute('value'));
							},
							commit : function (element) {
								var i = element.getItem(7);
								i.setAttribute('value', this.getValue());
							}
						},
						{
							type : 'text',
							id : 'shipping2',
							label : 'Frais de livraison pour les articles additionnels',
							//validate : CKEDITOR.dialog.validate.notEmpty('Indiquer les frais de livraison pour les articles commandes en plus'),
							setup: function (element) {
									var i = element.getItem(8);
									this.setValue(i.getAttribute('value'));
							},
							commit : function (element) {
								var i = element.getItem(8);
								i.setAttribute('value', this.getValue());
							}
						}/*,
						{
							type : 'text',
							id : 'tax',
							label : 'taxe',
						//	validate : CKEDITOR.dialog.validate.notEmpty('Fournir le montant de la TVA'),
							setup: function (element) {
									var i = element.getItem(10);
									this.setValue(i.getAttribute('value'));
							},
							commit : function (element) {
								var i = element.getItem(10);
								i.setAttribute('value', this.getValue());
							}
						}*/
					]
				}],
				onShow: function () {
					//var sel = editor.getSelection();
					//var element = sel.getStartElement();
					//console.info(element.getParent('fat_free_cart'));
					
					//	this.item_list = element.getChildren();
					//	element.remove();
						//this.insertMode = true;
						//console.info(this.insertMode);
						//element = editor.document.createElement('fat_free_cart'); 
						var element = editor.document.createElement('div');
						element.setAttribute('name', 'fat_free_cart');
						
						var f = editor.document.createElement("form");
						f.setAttribute('name',"fat_free_cart_form");
						f.setAttribute('action',"https://www.e-junkie.com/ecom/fgb.php?c=cart&cl=1&ejc=2");
						f.setAttribute('target', "ej_ejc");
						f.setAttribute('method',"post");
						//f.appendTo(element);
						//element.append(f);
						
						var paypal_email = editor.document.createElement("input"); //input element, text
						paypal_email.setAttribute('type',"hidden");
						paypal_email.setAttribute('name',"business");
						paypal_email.setAttribute('value',"_AUTOCONFIGWIKID_paypal_email_AUTOCONFIGWIKID_");
						f.append(paypal_email);
						
						var site_url = editor.document.createElement("input"); //input element, text
						site_url.setAttribute('type',"hidden");
						site_url.setAttribute('name',"site_url");
						site_url.setAttribute('value',"_AUTOCONFIGWIKID_site_url_AUTOCONFIGWIKID_");
						f.append(site_url);
						
						var contact_email = editor.document.createElement("input"); //input element, text
						contact_email.setAttribute('type',"hidden");
						contact_email.setAttribute('name',"contact_email");
						contact_email.setAttribute('value',"_AUTOCONFIGWIKID_admin_email_AUTOCONFIGWIKID_");
						f.append(contact_email);
						
						var item_name = editor.document.createElement("input"); //input element, text
						item_name.setAttribute('type',"hidden");
						item_name.setAttribute('name',"item_name");
						item_name.setAttribute('value',"item_name");
						f.append(item_name);
						
						var item_number = editor.document.createElement("input"); //input element, text
						item_number.setAttribute('type',"hidden");
						item_number.setAttribute('name',"item_number");
						item_number.setAttribute('value',"0");
						f.append(item_number);
						
						var price = editor.document.createElement("input"); //input element, text
						price.setAttribute('type',"hidden");
						price.setAttribute('name',"amount");
						price.setAttribute('value', '0.00');
						f.append(price);
						
						var quantity = editor.document.createElement("input"); //input element, text
						quantity.setAttribute('type',"hidden");
						quantity.setAttribute('name',"quantity");
						quantity.setAttribute('value', '1');
						f.append(quantity);
						
						
						var shipping = editor.document.createElement("input"); //input element, text
						shipping.setAttribute('type',"hidden");
						shipping.setAttribute('name',"shipping");
						shipping.setAttribute('value', '0.0');
						f.append(shipping);
						
						var shipping2 = editor.document.createElement("input"); //input element, text
						shipping2.setAttribute('type',"hidden");
						shipping2.setAttribute('name',"shipping2");
						shipping2.setAttribute('value', '0.0');
						f.append(shipping2);
						
						var handling = editor.document.createElement("input"); //input element, text
						handling.setAttribute('type',"hidden");
						handling.setAttribute('name',"handling");
						handling.setAttribute('value', '0.0')
						f.append(handling);
						
						/*var tax = editor.document.createElement("input"); //input element, text
						tax.setAttribute('type',"hidden");
						tax.setAttribute('name',"tax");
						tax.setAttribute('value', '0.00')
						f.append(tax);*/
						
						var thanks_page_url = editor.document.createElement("input"); //input element, text
						thanks_page_url.setAttribute('type',"hidden");
						thanks_page_url.setAttribute('name',"return_url");
						thanks_page_url.setAttribute('value',"_AUTOCONFIGWIKID_site_url_AUTOCONFIGWIKID_" + "/show/thanks");
						f.append(thanks_page_url);
						
						var currency = editor.document.createElement("input"); //input element, text
						currency.setAttribute('type',"hidden");
						currency.setAttribute('name',"currency_code");
						currency.setAttribute('value',"EUR");
						f.append(currency);
						
						var bouton = editor.document.createElement("input"); //input element, text
						bouton.setAttribute('type',"image");
						bouton.setAttribute('src',this_path + 'images/add.png');
						bouton.setAttribute('title','Ajouter au panier');
						bouton.setAttribute("onclick","javascript:return EJEJC_lc(this.parentNode);");
						
						f.append(bouton);
						
						var view_cart_button_code = editor.document.createElement("div");
						
						var html_string = [
				    			'<a href="https://www.e-junkie.com/ecom/fgb.php?	c=cart&cl=1&ejc=2&business= ',
				    			'_AUTOCONFIGWIKID_paypal_email_AUTOCONFIGWIKID_',
				    			' " target="ej_ejc" class="ec_ejc_thkbx" onClick="javascript:return EJEJC_lc(this);"><img src=',
				    			this_path,
				    			'images/cart3d.png border="0" title="Voir le panier"></a>',
				    			'<script language="javascript" type="text/javascript">',
				    			'<!--',
				    			'function EJEJC_lc(th) { return false; }',
				    			'function EJEJC_config() {',
				    				'EJEJC_POSTCALL = true;}',
				    			'function EJEJC_shown() {',
				    				// Change the Your Shopping Cart header image:
								'jQuery("#imgHeader").attr("src", "' + this_path + 'images/Shoppingcart_128x128.png");',
								// Change the PayPal checkout button image:
								'jQuery("#btnPP").attr("src", "https://www.paypalobjects.com/fr_FR/i/btn/btn1_for_hub.gif");',
				    				'jQuery("#btnUpdtCart").next().next("input").attr("value", "Poursuivre les achats");',
								'jQuery("#btnUpdtCart").attr("value", "Rafraichir le panier");',
								'jQuery("#btnContShop").attr("value", "Poursuivre les achats");',
								'jQuery("#EJEJC_closeWindowButton").html("fermer");',
								'jQuery("#EJEJC_closeWindowButton").attr("title", "fermer");',
								'var value = jQuery("#ejejctable").html();',
								'value = value.replace("Item", "Element");',
								'value = value.replace("Remove", "Supprimer");',
								'value = value.replace("Quantity", "Quantité");',
								'value = value.replace("Price", "Prix");',
								'value = value.replace("EUR", "EUR TTC");',
								'value = value.replace("Tax", "Taxe");',
								'value = value.replace("Your cart is empty", "Votre panier est vide");',
								'console.info(value);',
								'jQuery("#ejejctable").html(value);',
							'}',
				    			'// -->',
				    			'</script>',
				    			'<script type="text/javascript"src="https://www.e-junkie.com/ecom/box.js"></script>',
						].join('');
						view_cart_button_code.setHtml(html_string);
						element.append(f);	
						view_cart_button_code.appendTo(element);
						//f.appendTo(element);
						
					//console.info(element);
					this.element = element;
					//console.info(element.getChild(0));
					this.element_form = element.getChild(0).getChildren();
					this.setupContent(this.element_form);
				/*	for (var i = 0; i < item_list.count(); i++ ) {
						item = item_list.getItem(i);
						if ( item && item.data( 'cke-real-element-type' ) && item.data( 'cke-real-element-type' ) == 'hiddenfield' ){
							var hiddenField = item;
							item = editor.restoreRealElement(hiddenField);
							item_list[i] = item;
							sel.selectElement( this.element );
						}}
					console.info(item_list);
					*/
				},
				buttons : [ CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton ],
				onOk: function () {
					var dialog = this;
					//var link = this.element; //été initialisé dans onShow()
				//	console.info(this.element);
					this.commitContent(this.element_form);
					editor.insertElement(this.element);
					
					
					//link.setHtml(link.contenu); //voir dans setup element
					//editor.insertElement(link);
				}
			};
			return dialogDefinition;
		});
	}
});
