import { levenshtein } from './utils';
import { config } from './config';
export async function multiSearchHandler(search, items, sortedItems) {
	const char = search.charAt(0);
	const itemList = sortedItems[char] ? sortedItems[char] : items;
	const list = {
		match: [],
		alt: [],
	};
	let results = [];

	const wordsMatch = (item) => {
		const reg = new RegExp(search.replace(/\W+/g, '|'), 'i');

		if (reg.test(item)) list['match'].push(item);
		return;
	};

	// TODO: Alt words doesn't fit in new logic
	const AltMatch = (item) => {
		const distance = levenshtein(item, search);

		if (distance <= config.MIN_DISTANCE) list['alt'].push(item);
		return;
	};

	for (let i = 0; i < itemList.length; i++) {
		wordsMatch(itemList[i]);
		AltMatch(itemList[i]);
	}

	const sortMatches = sortResults(list['match'], search);

	results = new Set([...sortMatches, ...list['alt'].sort()]);

	return Promise.resolve([...results].slice(0, config.ITEM_CAP));
}

function sortResults(list, searchText) {
	const results = [];
	const full = new RegExp(searchText, 'i');
	const par = new RegExp(`${searchText.replace(/\W+/g, '|')}`, 'i');
	const unsortedlist = {};

	const unfilterd = list
		.sort()
		.filter((item) => {
			// full match on first word
			const m = full.exec(item);
			if (m && m.index === 0) {
				results.push(item);
				return false;
			} else return true;
		})
		.filter((item) => {
			// full match on any word
			if (full.test(item)) {
				results.push(item);
				return false;
			} else return true;
		})
		.filter((item) => {
			const m = par.exec(item);
			if (m) {
				unsortedlist[item] = m.index;
				return false;
			} else return true;
		});

	const sortedList = Object.keys(unsortedlist).sort((a, b) => {
		return unsortedlist[a] - unsortedlist[b];
	});

	return [...results, ...sortedList, ...unfilterd];
}
