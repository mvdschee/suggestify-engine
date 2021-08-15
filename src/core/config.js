export const config = {
	MIN_DISTANCE: 3,
	ITEM_CAP: 8,
	RATELIMIT_CAP: 50,
	RATELIMIT_TEXT: 'Too Many Requests',
	INTERNAL_ERROR: 'Woopsie, we will look into it!',
	ALLOWED_ORIGINS: ['http://localhost:3000', 'https://suggestify.maxvanderschee.nl'],
	SANITIZE: {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;',
		'`': '&grave;',
		'/': '&#x2F;',
	},
};
