module.exports = (app) => {
	return {
		getTime() {
			return (
				new Date().getHours() +
				':' +
				new Date().getMinutes() +
				':' +
				new Date().getSeconds()
			);
		},

		createMainPrefix() {
			return `${app.config.colors.default}[${app.config.colors.green}${
				app.config.environ['name']
			}${app.config.colors.default}/${app.config.colors.yellow}${this.getTime()}${
				app.config.colors.default
			}]`;
		},

		createPrefix(type, color) {
			return `${this.createMainPrefix()}: ${
				app.config.colors.default
			}[${color}${type.toUpperCase()}${app.config.colors.default}]`;
		},

		loadConsole() {
			var dict = {};

			for (let [key, value] of Object.entries(console)) {
				dict[key] = value;
			}

			for (let [key, value] of Object.entries(app.config.log.colors)) {
				console[key] = (content) => {
					dict[key](
						`${this.createPrefix(key, value)}${app.config.colors.black} ➜  ${
							app.config.colors.default
						}${content}`
					);
				};
			}

			console['request'] = (content) => {
				dict['log'](
					`${this.createPrefix('REQUEST', app.config.colors.yellow)}${
						app.config.colors.black
					} ➜  ${app.config.colors.default}${content}`
				);
			};
		},
	};
};
