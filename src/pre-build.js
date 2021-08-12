const _items = require('../api/items.json');
const fs = require('fs');

module.exports.init = () => {
	console.log('test');
	const test = {};

	for (let a = 0; a < _items.length; a++) {
		const char = _items[a].charAt(0);

		if (test[char]) test[char].push(_items[a]);
		else test[char] = [_items[a]];
	}

	writeToFile(test);
};

function writeToFile(obj) {
	fs.writeFile('./api/sorted.json', JSON.stringify(obj), (err) => {
		if (err) return console.error(err);
	});
}
