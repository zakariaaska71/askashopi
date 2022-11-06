module.exports = (app) => {
	return {
		utils: `${__rootpath}\\src\\utils`,
		config: `${__rootpath}\\src\\config`,
		shopify: `${__rootpath}\\src\\shopify`,

		discord: {
			events: `${__rootpath}\\src\\client\\events`,
			commands: `${__rootpath}\\src\\client\\commands`,
		},
	};
};
