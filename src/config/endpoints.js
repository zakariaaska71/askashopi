module.exports = (app) => {
	return {
		products_info: (shop_url) => `https://${shop_url}/products.json`,
	};
};
