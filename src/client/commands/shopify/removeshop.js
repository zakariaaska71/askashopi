module.exports.run = async (app, client, message, args) => {
	const shop_index = args[0];

	if (app.shopify.config.shops[shop_index]) {
		const shop_url = app.shopify.config.shops[shop_index];

		await app.utils.shopify.removeShop(shop_index);

		await app.utils.shopify.loadProducts();

		const embed = app.utils.discord.createEmbed('info', {
			title: `Shop entfernt [${shop_url}]`,
			description: `\`\`${shop_url}\`\` wurde erfolgreich aus der Datenbank entfernt.`,
		});

		return await message.channel.send({ embeds: [embed] });
	} else {
		const embed = app.utils.discord.createEmbed('error', {
			description: 'Der Shop existiert nicht',
		});

		return await message.channel.send({ embeds: [embed] });
	}
};

module.exports.conf = {
	name: 'removeshop',
	description: 'Entferne einen Shop aus der DB',
	category: 'Shopify',

	owner: false,
	premium: false,
	admin: false,

	guild: true,
	dm: false,

	disabled: false,

	usage: ['removeshop <index>'],
	example: ['removeshop 0'],

	aliases: ["remove"],

	minArgs: 0,
	maxArgs: 0,
};
