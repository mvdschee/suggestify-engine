const _items = require('./data_two/default.json');
const _recommended = require('./data_two/recommended.json');
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
	const dir = './api/data';

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}

	fs.writeFile('./api/data/sorted.json', JSON.stringify(obj), (err) => {
		if (err) return console.error(err);
	});

	fs.writeFile('./api/data/default.json', JSON.stringify(_items), (err) => {
		if (err) return console.error(err);
	});

	fs.writeFile('./api/data/recommended.json', JSON.stringify(_recommended), (err) => {
		if (err) return console.error(err);
	});
}
