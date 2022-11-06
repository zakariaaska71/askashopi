module.exports = (app) => {
	return {
		async sleep(ms) {
			return new Promise((resolve) => {
				setTimeout(resolve, ms);
			});
		},

		randomIntFromInterval(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min);
		},

		getDateStringServ(timestamp) {
			const plus0 = (num) => `0${num.toString()}`.slice(-2);

			const d = new Date(timestamp);

			const monthTmp = d.getMonth() + 1;
			const month = plus0(monthTmp);
			const date = plus0(d.getDate());
			const hour = plus0(d.getHours());
			const minute = plus0(d.getMinutes());
			const second = plus0(d.getSeconds());

			return `${month}/${date} ${hour}:${minute}:${second}`;
		},
	};
};
