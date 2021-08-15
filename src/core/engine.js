import { levenshtein } from './utils';
import { config } from './config';

export async function suggestifyEngine(userInput, _items, _sorted) {
	const char = userInput.charAt(0);
	const items = _sorted[char] ? _sorted[char] : _items;
	const globalReg = new RegExp(userInput.replace(/\W+/g, '|'), 'i');

	const list = {
		match: [],
		alt: [],
	};

	const wordsMatch = (item) => {
		if (globalReg.test(item)) list['match'].push(item);
		return;
	};

	const AltMatch = (item) => {
		if (levenshtein(item, userInput) <= config.MIN_DISTANCE) list['alt'].push(item);
		return;
	};

	for (let i = 0; i < items.length; i++) {
		wordsMatch(items[i]);
	}

	if (list['match'].length <= config.ITEM_CAP) {
		for (let i = 0; i < items.length; i++) {
			AltMatch(items[i]);
		}
	}

	const sortMatches = sortResults(list['match'], userInput);
	const results = new Set([...sortMatches, ...list['alt'].sort()]);

	return Promise.resolve([...results].slice(0, config.ITEM_CAP));
}

function sortResults(list, userInput) {
	const results = [];
	const full = new RegExp(userInput, 'i');
	const par = new RegExp(userInput.replace(/\W+/g, '|'), 'i');
	const unsortedlist = {};

	const unfilterd = list
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
