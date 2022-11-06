module.exports = (app) => {
	return {
		async login(client, token) {
			return await client.login(token);
		},

		disconnect(client) {
			return async function () {
				console.log('Disconnecting Bot');
				await client.user.setStatus('invisible');
				await client.destroy();
				try {
					process.exit(0);
				} catch {}
			};
		},

		loadIntents() {
			[
				'GUILDS',
				'GUILD_MEMBERS',
				'GUILD_BANS',
				'GUILD_EMOJIS_AND_STICKERS',
				'GUILD_MESSAGES',
				'GUILD_MESSAGE_REACTIONS',
				'GUILD_MESSAGE_TYPING',
				'DIRECT_MESSAGES',
				'DIRECT_MESSAGE_REACTIONS',
				'DIRECT_MESSAGE_TYPING',
			].forEach((intent) => {
				app.discord.intents.add(app.modules.discord.Intents.FLAGS[intent]);
			});
		},

		loadEvents(client) {
			app.modules.fs
				.readdirSync(app.config.paths.discord.events)
				.forEach(async (file) => {
					const event = require(`${app.config.paths.discord.events}/${file}`);
					const eventname = file.slice(file.lastIndexOf('/') + 1, file.length - 3);
					try {
						console.log(`Loading event "${eventname}"`);
						app.discord.collections.events.set(eventname, event);
						client.on(eventname, (...args) => {
							event.run(app, client, ...args);
						});
					} catch (err) {
						console.error(`Could not load "${file}" => ${err}`);
					}
				});
			console.log(
				`Successfully loaded ${app.discord.collections.events.size} event(s)`
			);
		},

		loadCommands() {
			app.modules.fs
				.readdirSync(app.config.paths.discord.commands)
				.forEach((directory) => {
					const commands = app.modules.fs.readdirSync(
						`${app.config.paths.discord.commands}/${directory}`
					);

					for (const file of commands) {
						try {
							const pull = require(`${app.config.paths.discord.commands}/${directory}/${file}`);

							if (!pull.conf) {
								break;
							}
							app.discord.collections.commands.set(pull.conf.name, pull);
							if (pull.conf.aliases && Array.isArray(pull.conf.aliases))
								pull.conf.aliases.forEach((v) =>
									app.discord.collections.aliases.set(v, pull.conf.name)
								);
								console.log(`Loading command "${pull.conf.name}"`);
						} catch (err) {
							console.error(`Could not load "${file}" => ${err}`);
						}
					}
				});

			console.log(
				`Successfully (re)loaded ${app.discord.collections.commands.size} command(s)`
			);
		},

		async validateCommand(client, message, command) {
			if (message.guild && !command.conf.guild) {
				await message.channel.send({
					embeds: [
						app.utils.discord.createEmbed(
							'error',
							{
								description: "This command can't be used in a server!",
							},
							message
						),
					],
				});
				return false;
			} else if (message.channel.type == 'dm' && !command.conf.dm) {
				await message.channel.send({
					embeds: [
						app.utils.discord.createEmbed(
							'error',
							{
								description: "This command can't be used in a private conversation!",
							},
							message
						),
					],
				});
				return false;
			}

			if (command.conf.disabled) {
				await message.channel.send({
					embeds: [
						app.utils.discord.createEmbed(
							'error',
							{
								description: 'This command is currently disabled!',
							},
							message
						),
					],
				});
				return false;
			}

			return true;
		},

		createEmbed(type = 'info', options = {}, message = null) {
			type = type.toLowerCase();

			let embed = new app.modules.discord.MessageEmbed({
				color: app.config.discord.embeds[type].color,
			});
			[
				'type',
				'title',
				'description',
				'url',
				'color',
				'timestamp',
				'thumbnail',
				'image',
				'video',
				'author',
				'provider',
				'footer',
			].forEach((option) => {
				if (options[option]) embed[option] = options[option];
			});

			if (options['fields']) {
				options['fields'].forEach((field) => {
					embed.fields[embed.fields.length] = field;
				});
			}

			if (message) {
				if (message.author) {
					userId = message.author.id;
					if (!embed.author)
						embed.setAuthor(
							message.author.username,
							message.author.displayAvatarURL({
								dynamic: true,
								size: 1024,
							})
						);
				} else if (message.user) {
					userId = message.user.id;
					if (!embed.author)
						embed.setAuthor(
							message.user.username,
							message.user.displayAvatarURL({
								dynamic: true,
								size: 1024,
							})
						);
				}

				if (!embed.footer) {
					if (message.guild && message.guild.iconURL()) {
						embed.footer = {
							text: app.config.discord.embeds.footer,
							icon_url: message.guild.iconURL(),
						};
					} else {
						embed.footer = {
							text: app.config.discord.embeds.footer,
						};
					}
					if (!embed.timestamp) {
						embed.timestamp = new Date();
					}
				}
			} else {
				if (!embed.footer) {
					embed.footer = {
						text: app.config.discord.embeds.footer,
					};
				}

				if (!embed.timestamp) {
					embed.timestamp = new Date();
				}
			}

			return embed;
		},
	};
};
