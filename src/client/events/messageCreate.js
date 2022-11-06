module.exports.run = async (app, client, message) => {
	// Deprecated

	if (message.author.bot || message.system) return;

	if (!message.member && message.guild)
		message.member = await message.guild.members.fetch(message.author);
	
	const prefix = app.config.discord.prefix;

	if (!message.content.startsWith(prefix)) return;

	const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

	const command =
		app.discord.collections.commands.get(cmd.toLowerCase()) ||
		app.discord.collections.commands.get(
			app.discord.collections.aliases.get(cmd.toLowerCase())
		);

	if (!command) {
		if (!cmd.length) {
			return;
		}
	}


	if (command && await app.utils.discord.validateCommand(client, message, command)) {
		await command.run(app, client, message, args);
	}
};
