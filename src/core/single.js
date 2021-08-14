import { config } from './config';

export async function singleSearchHandler(search, items, sortedItems) {
	const char = search.charAt(0);
	const itemList = sortedItems[char] ? sortedItems[char] : items;
	const reg = new RegExp(search.replace(/\W+/g, '|'), 'i');
	const results = [];

	for (let i = 0; i < itemList.length; i++) {
		const m = reg.exec(itemList[i]);
		if (m && m.index === 0) results.push(itemList[i].toLowerCase());
		if (results.length === config.ITEM_CAP) break;
	}

	return Promise.resolve(results.sort());
}
