export default async function suggestifyEngine(userInput, _items, _sorted, options) {
	const char = userInput.charAt(0);
	const items = _sorted[char] ? _sorted[char] : _items;
	const globalReg = new RegExp(userInput.replace(/\W+/g, '|'), 'i');
	const config = {
		MIN_DISTANCE: options.MIN_DISTANCE | 3,
		ITEM_CAP: options.ITEM_CAP | 8,
	};

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

const sortResults = (list, userInput) => {
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
};

// levenshtein distance
const levenshtein = (s, t) => {
	if (!s.length) return t.length;
	if (!t.length) return s.length;
	const arr = [];
	for (let i = 0; i <= t.length; i++) {
		arr[i] = [i];
		for (let j = 1; j <= s.length; j++) {
			arr[i][j] =
				i === 0
					? j
					: Math.min(
							arr[i - 1][j] + 1,
							arr[i][j - 1] + 1,
							arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
					  );
		}
	}
	return arr[t.length][s.length];
};
