import { config } from './config';

export async function singleSearchHandler(search, items, sortedItems) {
	const results = [];
	const char = search.charAt(0);
	const reg = new RegExp(search.replace(/\W+/g, '|'), 'i');

	if (sortedItems[char]) {
		for (let i = 0; i < sortedItems[char].length; i++) {
			const words = sortedItems[char][i];
			const m = reg.exec(words);
			if (m && m.index === 0) results.push(words.toLowerCase());
			if (results.length === config.ITEM_CAP) break;
		}
	} else {
		for (let i = 0; i < items.length; i++) {
			const m = reg.exec(items[i]);
			if (m && m.index === 0) results.push(items[i].toLowerCase());
			if (results.length === config.ITEM_CAP) break;
		}
	}

	return Promise.resolve(results.sort());
}
