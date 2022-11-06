module.exports = (app) => {
	return {
		sliceFileName(fileName) {
			return fileName.split('.')[0];
		},

		makeId(length) {
			var result = '';
			var characters =
				'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			var charactersLength = characters.length;
			for (var i = 0; i < length; i++) {
				result += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
			return result;
		},

		loadJson(path) {
			return JSON.parse(app.modules.fs.readFileSync(path));
		},

		saveJson(path, data) {
			app.modules.fs.writeFileSync(path, JSON.stringify(data, null, 3))
		},

		matchExpression(str) {
			var rgularExp = {
				contains_alphaNumeric: /^(?!-)(?!.*-)[A-Za-z0-9-]+(?<!-)$/,
				containsNumber: /\d+/,
				containsAlphabet: /[a-zA-Z]/,

				onlyLetters: /^[A-Za-z]+$/,
				onlyNumbers: /^[0-9]+$/,
				onlyMixOfAlphaNumeric: /^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$/,
				isEmail:
					/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			};

			var expMatch = {};
			expMatch.containsNumber = rgularExp.containsNumber.test(str);
			expMatch.containsAlphabet = rgularExp.containsAlphabet.test(str);
			expMatch.alphaNumeric = rgularExp.contains_alphaNumeric.test(str);

			expMatch.onlyNumbers = rgularExp.onlyNumbers.test(str);
			expMatch.onlyLetters = rgularExp.onlyLetters.test(str);
			expMatch.mixOfAlphaNumeric = rgularExp.onlyMixOfAlphaNumeric.test(str);
			expMatch.isEmail = rgularExp.isEmail.test(str);

			return expMatch;
		},

		async load_products() {},
	};
};
