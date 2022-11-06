const { default: axios } = require('axios');

module.exports = (app) => {
	return {
		async removeShop(index) {
			const shop_url = app.shopify.config['shops'][index];
			app.shopify.config['shops'].splice(index, 1);

			await app.utils.data.saveJson(
				`${app.config.paths.shopify}\\config.json`,
				app.shopify.config
			);

			console.log(`Removed ${shop_url} from memory database`);
		},

		async loadProducts() {
			app.shopify.config['shops'].forEach(async (shop_url) => {
				await app.utils.time.sleep(app.utils.time.randomIntFromInterval(1000, 10000));
				if (!app.shopify.database[shop_url]) {
					var data = (
						await app.modules.axios.get(app.config.endpoints.products_info(shop_url))
					).data;

					app.shopify.database[shop_url] = {
						products: {},
						started_at: new Date().getTime(),
					};

					data.products.forEach((value) => {
						app.shopify.database[shop_url]['products'][value['id']] =
							this.createProductObject(value);
						app.shopify.database[shop_url]['products'][value['id']]['sales'] = [];
					});

					console.log(
						`Added ${shop_url} with ${Object.keys(app.shopify.database[shop_url]['products']).length
						} products to memory database`
					);
				}
			});
		},

		async checkForNewProducts(shop_url, data) {
			data.products.forEach((product) => {
				if (!app.shopify.database[shop_url]['products'][`${product['id']}`]) {
					app.shopify.database[shop_url]['products'][`${product['id']}`] =
						this.createProductObject(product);
					app.shopify.database[shop_url]['products'][`${product['id']}`]['sales'] = [];

					console.log(
						`Added new product ${product['title']} from ${shop_url} to memory database`
					);
				}
			});
		},

		async getLatestSale(shop_url, product_id) {
			return app.shopify.database[shop_url]['products'][`${product_id}`]
				? app.shopify.database[shop_url]['products'][`${product_id}`]['updated_at']
				: undefined;
		},

		async updateLatestSale(shop_url, data, sold_variant) {
			app.shopify.database[shop_url]['products'][`${data['id']}`]['sales'].push({
				time: data['updated_at'],
				variant: sold_variant,
				price: sold_variant ? sold_variant['price'] : data['variants'][0]['price'],
			});
			app.shopify.database[shop_url]['products'][`${data['id']}`]['updated_at'] =
				data['updated_at'];
		},

		findImageById(images, id) {
			var image_url;
			images.forEach((image) => {
				if (image.id == id) {
					image_url = image['src'];
				}
			});

			return image_url;
		},

		// ON NEW SALE EVENT
		async onNewSale(shop_url, data, sold_variant) {
			let field_text = '';
			let key_translations = {
				title: 'Titel',
				sku: 'SKU',
				price: 'Preis',
				compare_at_price: 'Vergleichspreis',
				position: 'Position',
				product_id: 'Identifier',
			};

			const all_together = this.getProductSalesAmount(
				shop_url,
				data['id'],
				sold_variant ? sold_variant['product_id'] : undefined
			);

			if (sold_variant) {
				['title', 'sku', 'compare_at_price', 'price'].forEach((key) => {
					if (sold_variant[key]) {
						field_text += `**${key_translations[key]}**: \`\`${sold_variant[key]}\`\`\n`;
					}
				});
			}

			var summary_shop = await this.getShopSalesAmount(shop_url)

			const field = sold_variant
				? {
					name: 'Variante:',
					value: field_text,
					inline: true,
				}
				: undefined;

			const field2 = sold_variant
				? {
					name: 'Statistiken (Variante):',
					value: `**Geschätzte Einnahmen:** \`\`${all_together['variant']}\`\`\n**Verkauft:** \`\`${all_together['variant_quantity']}x\`\``,
					inline: true,
				}
				: undefined;

			const field3 = {
				name: 'Statistiken (Shop):',
				value: `**Geschätzte Einnahmen:** \`\`${summary_shop}\`\``,
				inline: false,
			};

			const embed = app.utils.discord.createEmbed('info', {
				title: `Neuer Verkauf [${shop_url}]`,
				description: `[Klicke hier um auf die Produktseite zu gelangen](https://${shop_url}/products/${data['handle']
					})\n**Produkt:** \`\`${data['title']
					}\`\`\n**Verkauft um:** \`\`${app.utils.time.getDateStringServ(
						data['updated_at']
					)}\`\`\n**Tracker gestartet um:** \`\`${app.utils.time.getDateStringServ(
						app.shopify.database.started_at
					)}\`\`\n**Preis:** ${data['variants'][0]['compare_at_price']
						? `${data['variants'][0]['price']} ~~${data['variants'][0]['compare_at_price']}~~`
						: `\`\`${data['variants'][0]['price']}\`\``
					}`,

				thumbnail: {
					url: sold_variant
						? sold_variant['featured_image']
							? this.findImageById(data.images, sold_variant['featured_image']['id'])
							: data['images'][0]['src']
						: data['images'][0]['src'],
				},
				fields: sold_variant
					? [
						field,
						{
							name: 'Statistiken  (Produkt):',
							value: `**Einnahmen:** \`\`${all_together['product']}\`\`\n**Verkauft:** \`\`${all_together['product_quantity']}x\`\``,
							inline: true,
						},
						field2,
						field3,
					]
					: [
						{
							name: 'Statistiken (Produkt):',
							value: `**Einnahmen:** \`\`${all_together['product']}\`\`\n**Verkauft:** \`\`${all_together['product_quantity']}x\`\``,
							inline: true,
						},
						field3
					],
				color: 3066993,
			});

			await app.modules.axios.post(
				app.shopify.config['webhooks'][shop_url]
					? app.shopify.config['webhooks'][shop_url]
					: app.shopify.config['webhooks']['default'],
				JSON.stringify({ embeds: [embed] }),
				{
					headers: {
						'Content-type': 'application/json',
					},
				}
			);
		},

		async addNewShopToConfig(shop_url, webhook_url = undefined) {
			app.shopify.config.shops.push(shop_url);

			if (webhook_url) {
				app.shopify.config.webhooks[shop_url] = webhook_url;
			}

			await this.saveNewConfig();
		},

		async saveNewConfig() {
			await app.utils.data.saveJson(
				`${app.config.paths.shopify}\\config.json`,
				app.shopify.config
			);
		},

		createProductObject(value) {
			return {
				id: value['id'],
				title: value['title'],
				vendor: value['vendor'],
				handle: value['handle'],

				published_at: value['published_at'],
				created_at: value['created_at'],
				updated_at: value['updated_at'],

				variants: value['variants'],
				images: value['images'],

				options: value['options'],
				tags: value['tags'],
				product_type: value['product_type'],

				body_html: value['body_html'],

				sales: [],
			};
		},

		getProductSalesAmount(shop_url, product_id, variant_id = undefined) {
			let variant_sales = 0.0;
			let variant_sales_array = [];
			let product_sales = 0.0;
			app.shopify.database[shop_url]['products'][`${product_id}`]['sales'].forEach(
				async (sale) => {
					if (variant_id) {
						if (sale.variant.product_id == variant_id) {
							variant_sales_array.push(sale);
							variant_sales += parseFloat(sale.price);
						}
					}

					product_sales += parseFloat(sale.price);
				}
			);

			return {
				variant: variant_sales,
				variant_quantity: variant_sales_array.length,
				product: product_sales,
				product_quantity:
					app.shopify.database[shop_url]['products'][`${product_id}`]['sales'].length,
			};
		},



		checkForDiff(old_product, new_product) {
			const diff = app.modules.jsondiff.diff(
				this.createProductObject(old_product),
				this.createProductObject(new_product)
			);

			var sold_variant;
			var new_sale;

			if (Object.entries(diff).length <= 2) {
				if (diff['updated_at']) {
					new_sale = true;
					if (diff['variants']) {
						for (let [key, value] of Object.entries(old_product['variants'])) {
							if (value['updated_at'] != new_product['variants'][key]['updated_at']) {
								sold_variant = new_product['variants'][key];
								break;
							}
						}
					}
				}
			}

			return {
				diff: diff,
				new_sale: new_sale,
				sold_variant: sold_variant ? sold_variant : undefined,
			};
		},

		async getShopSalesAmount(shop_url) {
			let summary = 0;

			for (let [key, value] of Object.entries(app.shopify.database[shop_url]["products"])) {

				var product_sales = this.getProductSalesAmount(shop_url, value.id)

				summary += parseFloat(product_sales["product"])
			}

			return summary;
		},


		async checkForSale(shop_url) {
			const data = (await axios.get(app.config.endpoints.products_info(shop_url)))
				.data;

			await this.checkForNewProducts(shop_url, data);

			data.products.forEach(async (product) => {
				var last_sale = await this.getLatestSale(shop_url, product['id']);

				if (last_sale && product['updated_at'] != last_sale) {
					const prod = app.shopify.database[shop_url]['products'][`${product['id']}`];

					const diff = app.modules.jsondiff.diff(
						this.createProductObject(product),
						this.createProductObject(prod)
					);

					if (Object.entries(diff).length <= 2 && diff['updated_at']) {
						var sold_variant;

						if (diff['variants']) {
							const check = this.checkForDiff(prod, product);
							sold_variant = check['sold_variant'];
						} else {
							sold_variant = undefined;
						}

						await this.updateLatestSale(shop_url, product, sold_variant);

						console.log(
							`[${shop_url}] [${app.shopify.database[shop_url]['products'][`${product['id']}`]['sales'].length
							}] New sale -> ${product['title']}`
						);

						await this.onNewSale(shop_url, product, sold_variant);
					}
				}
			});
		},
	};
};
