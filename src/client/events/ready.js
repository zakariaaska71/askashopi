module.exports.run = async (app, client) => {
	console.log(
		`${client.user.username}#${client.user.discriminator} is now ready!`
	);

	['SIGINT', 'SIGQUIT', 'SIGTERM', 'beforeExit', 'exit'].forEach(
		(processEvent) => {
			process.on(processEvent, app.utils.discord.disconnect(client));
		}
	);

	// Prevent crashing
	['uncaughtException'].forEach((processEvent) => {
		process.on(processEvent, function (error) {
			console.error(`${processEvent} => ${error.stack}`);
		});
	});
};
