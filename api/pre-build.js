const _items = require('./items.json');
const fs = require('fs');
const test = require('./test.json');

const handler = async (req, res) => {
	const { query } = req;

	try {
		let start = process.hrtime();
		// await filterItems(_items);
		const test = await singleSearchHandler(query.q);
		let stop = process.hrtime(start);

		res.status(200).json({
			items: test,
			time: (stop[0] * 1e9 + stop[1]) / 1e9,
		});
		// res.status(200).send('okay');
	} catch (error) {
		return res.status(500).send('Woopsie, we will look into it!');
	}
};

async function filterItems(items) {
	const test = {};

	for (let a = 0; a < items.length; a++) {
		const wordsArray = items[a].split(' ');

		for (let b = 0; b < wordsArray.length; b++) {
			const word = wordsArray[b];
			const char = word.charAt(0);

			if (test[char]) test[char].push(items[a]);
			else test[char] = [items[a]];
		}
	}

	writeToFile(test);
}

async function singleSearchHandler(search) {
	const results = [];
	const char = search.charAt(0);
	const reg = new RegExp(search.replace(/\W+/g, '|'), 'i');

	if (test[char]) {
		// 	console.log('test');

		// 	for (let i = 0; i < test[char].length; i++) {
		// 		const words = test[char][i];
		// 		const m = reg.exec(words);
		// 		// if (m) console.log(m);
		// 		if (m && m.index === 0) results.push(words.toLowerCase());
		// 		if (results.length === 8) break;
		// 	}
		// } else {
		for (let i = 0; i < _items.length; i++) {
			const m = reg.exec(_items[i]);
			if (m && m.index === 0) results.push(_items[i].toLowerCase());
			if (results.length === 8) break;
		}
	}

	return Promise.resolve(results.sort());
}

function writeToFile(obj) {
	fs.writeFile('./api/test.json', JSON.stringify(obj), (err) => {
		if (err) return console.error(err);
	});
}

export default handler;
