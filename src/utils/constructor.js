module.exports = (app) => {
	return {
		async load() {
			this.loadVariables();
			this.loadConfigs();
			this.loadUtils();
			app.utils['log'].loadConsole();
			await this.loadShopifyConfig();
		},

		loadVariables() {
			['config', 'utils'].forEach((constructor_var) => {
				if (!app[constructor_var]) {
					app[constructor_var] = {};
				}
			});
		},

		loadConfigs() {
			app.modules.fs.readdirSync(`${__rootpath}/src/config`).forEach((file) => {
				if (!app.config[app.utils.data.sliceFileName(file)]) {
					app.config[app.utils.data.sliceFileName(file)] =
						require(`${__rootpath}/src/config/${file}`)(app);
				}
			});
		},

		loadUtils() {
			app.modules.fs.readdirSync(app.config.paths.utils).forEach((file) => {
				if (!app.utils[app.utils.data.sliceFileName(file)]) {
					app.utils[app.utils.data.sliceFileName(file)] =
						require(`${app.config.paths.utils}/${file}`)(app);
				}
			});
		},

		async loadShopifyConfig() {
			if (!app.shopify) {
				app.shopify = {
					config: app.utils.data.loadJson(`${app.config.paths.shopify}\\config.json`),
					database: {
						started_at: new Date().getTime(),
					},
				};
			}

			await app.utils.shopify.loadProducts();

			setInterval(async () => {
				var config_file = app.utils.data.loadJson(
					`${app.config.paths.shopify}\\config.json`
				);
				if (JSON.stringify(config_file) != JSON.stringify(app.shopify.config)) {
					for (let shop of app.shopify.config['shops']) {
						if (!config_file['shops'].includes(shop)) {
							await app.utils.shopify.removeShop(shop);
						}
					}

					console.log(`Detected changes in ${app.config.paths.shopify}\\config.json`);
					app.shopify.config = config_file;
					await app.utils.shopify.loadProducts();
				}
			}, 5000);
		},
	};
};
