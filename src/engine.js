export default class SuggestifyEngine {
	input;
	defaultItems;
	sortedItems;
	items;
	config;
	char;
	globalReg;

	constructor({ defaultItems, sortedItems, options }) {
		this.defaultItems = defaultItems;
		this.sortedItems = sortedItems;
		this.config = {
			MIN_DISTANCE: options.MIN_DISTANCE | 3,
			ITEM_CAP: options.ITEM_CAP | 8,
		};
	}

	async getResults(input) {
		// let start = process.hrtime();
		this.input = input;
		this.globalReg = new RegExp(input.replace(/\W+/g, '|'), 'i');

		this.char = input.charAt(0);
		this.items = this.sortedItems[this.char] ? this.sortedItems[this.char] : this.defaultItems;

		// let stop = process.hrtime(start);

		// console.log(`${(stop[0] * 1e3 + stop[1] / 1e6).toFixed(2)}ms`);
		return this.listFilter();
	}

	listFilter() {
		const list = {
			match: [],
			alt: [],
		};

		const wordsMatch = (item) => {
			if (this.globalReg.test(item)) list['match'].push(item);
			return;
		};

		const AltMatch = (item) => {
			if (this.levenshtein(item, this.input) <= this.config.MIN_DISTANCE) list['alt'].push(item);
			return;
		};

		const reachedCap = (type) => {
			return list[type].length >= this.config.ITEM_CAP;
		};

		for (let i = 0; i < this.items.length; i++) {
			wordsMatch(this.items[i]);
			AltMatch(this.items[i]);

			if (reachedCap('match') || reachedCap('alt')) break;
		}

		if (reachedCap('match') && reachedCap('alt')) {
			for (let i = 0; i < this.defaultItems.length; i++) {
				wordsMatch(this.defaultItems[i]);
				AltMatch(this.defaultItems[i]);

				if (reachedCap('match') || reachedCap('alt')) break;
			}
		}

		const results = new Set([
			...this.sortResults(this.input, list['match']),
			...this.sortResults(this.input, list['alt']),
		]);

		return [...results].slice(0, this.config.ITEM_CAP);
	}

	sortResults(text, items) {
		return items.sort((a, b) => {
			const i = this.levenshtein(text, a);
			const j = this.levenshtein(text, b);
			if (i > j) return 1;
			if (i < j) return -1;
			return 0;
		});
	}

	/**
	 * levenshtein calculates the distance between
	 * two strings, it's good for typo's and if the result is wanted
	 * @param { string } s
	 * @param { string } t
	 * @returns { number } number
	 */
	levenshtein(s, t) {
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
	}
}
