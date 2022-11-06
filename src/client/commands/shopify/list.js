module.exports.run = async (app, client, message, args) => {
	const shops = app.shopify.config.shops;

	let shops_ = [];

	for (let [key, value] of Object.entries(shops)) {
		shops_.push(
			`\`${value} - Custom Webhook: ${
				app.shopify.config.webhooks[value] ? '✅' : '❌'
			} - Index: ${key}\``
		);
	}

	const embed = app.utils.discord.createEmbed('info', {
		title: 'Shops',
		description: shops_.join('\n'),
	});

	await message.channel.send({ embeds: [embed] });
};

module.exports.conf = {
	name: 'list',
	description: 'Liste von allen Shops in der Memory db',
	category: 'Shopify',

	owner: false,
	premium: false,
	admin: false,

	guild: true,
	dm: true,

	disabled: false,

	usage: ['list'],
	example: ['list'],

	aliases: [],

	minArgs: 0,
	maxArgs: 0,
};
