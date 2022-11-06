class Tracker {
	constructor() {
		global.__rootpath = __dirname;

		this.modules = {
			fs: require('fs'),
			axios: require('axios'),
			discord: require('discord.js'),
			builders: require('@discordjs/builders'),
			rest: require('@discordjs/rest'),
			v9: require('discord-api-types/v9'),
			jsondiff: require('json-diff'),
		};

		this.utils = {
			constructor: require(`${__rootpath}/src/utils/constructor`)(this),
			data: require(`${__rootpath}/src/utils/data`)(this),
		};

		this.utils.constructor.load();

		this.discord = {
			collections: {
				commands: new this.modules.discord.Collection(),
				aliases: new this.modules.discord.Collection(),
				events: new this.modules.discord.Collection(),
			},
			intents: new this.modules.discord.Intents(),
			rest: new this.modules.rest.REST({ version: '9' }).setToken(
				this.config.discord.prod.token
			),
		};

		console.log(`Client initialized. — Node ${process.version}`);
	}

	async init() {
		this.utils.discord.loadIntents();
		this.discord.client = new this.modules.discord.Client({
			intents: this.discord.intents,
			partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
		});
		this.utils.discord.loadEvents(this.discord.client);
		this.utils.discord.loadCommands(this.discord.client);

		this.utils.discord.login(this.discord.client, this.config.discord.prod.token);

		setInterval(async () => {
			this.shopify.config.shops.forEach(async (shop_url) => {
				await this.utils.shopify.checkForSale(shop_url);
			});
		}, this.shopify.config.interval * 1000);
	}
}

new Tracker().init();
