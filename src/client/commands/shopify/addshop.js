module.exports.run = async (app, client, message, args) => {
	const shop_url = args[0];

	if (!app.shopify.config.shops.includes(shop_url)) {
		const server = message.guild;

		var webhook;

		if (!app.shopify.config.webhooks[shop_url]) {
			const channel_name = app.config.discord.shop_channel_name(shop_url);

			const channel = await server.channels.create(channel_name, {
				type: 'text',
			});

			await channel.setParent(app.config.discord.products_category);

			webhook = await channel.createWebhook(shop_url);
		}

		await app.utils.shopify.addNewShopToConfig(
			shop_url,
			webhook ? webhook.url : undefined
		);

		const embed = app.utils.discord.createEmbed('info', {
			title: `Shop hinzugefügt [${shop_url}]`,
			description: `\`\`${shop_url}\`\` wurde erfolgreich zur Datenbank hinzugefügt.`,
		});

		await app.utils.shopify.loadProducts();

		return await message.channel.send({ embeds: [embed] });
	} else {
		const embed = app.utils.discord.createEmbed('error', {
			description: 'Du hast diesen Shop bereits hinzugefügt',
		});

		return await message.channel.send({ embeds: [embed] });
	}
};

module.exports.conf = {
	name: 'addshop',
	description: 'Füge einen Shop in die db hinzu',
	category: 'Shopify',

	owner: false,
	premium: false,
	admin: false,

	guild: true,
	dm: false,

	disabled: false,

	usage: ['addshop <url>'],
	example: ['addshop hoopsport.de'],

	aliases: ["add"],

	minArgs: 0,
	maxArgs: 0,
};
