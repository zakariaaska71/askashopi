module.exports = (app) => {
	return {
		prod: {
			token: 'YOUR_TOKEN',
		},

		prefix: '!',

		embeds: {
			info: {
				color: 'BLUE',
			},
			error: {
				color: 'RED',
			},
			footer: 'Tracker v1',
		},

		products_category: '', // create a category in your server and put its id inside here

		shop_channel_name: (shop_url) =>
			`├${shop_url.split('.')[0]}`,
	};
};
