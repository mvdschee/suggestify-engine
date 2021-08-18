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

const levenshteinSort = (a, b) => {
	const am = levenshtein(search, a);
	const bm = levenshtein(search, b);
	if (am > bm) return 1;
	if (am < bm) return -1;
	return 0;
};

const search = 'ness ro';
const items = ['ness', 'nesselrode', 'nesselrodes', 'nesses', 'nerol', 'neroli', 'nerolis', 'nerols'];

const results = items.sort(levenshteinSort);

console.log(results);
