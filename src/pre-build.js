const _items = require('../api/items.json');
const fs = require('fs');

module.exports.init = () => {
	const sorted = {};

	for (let a = 0; a < _items.length; a++) {
		const char = _items[a].charAt(0);
		const item = _items[a].toLowerCase();

		if (sorted[char]) sorted[char].push(item);
		else sorted[char] = [item];
	}

	writeToFile(sorted);
};

function writeToFile(obj) {
	fs.writeFile('./api/sorted.json', JSON.stringify(obj), (err) => {
		if (err) return console.error(err);
	});
}
