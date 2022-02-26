const SuggestifyEngine = require('./lib/engine.cjs');
const _default = require('./test/default.json');
const _sorted = require('./test/sorted.json');

const engine = new SuggestifyEngine({
    defaultItems: _default,
    sortedItems: _sorted,
    options: {
        MIN_DISTANCE: 4,
        ITEM_CAP: 8,
    },
});

console.log('setup benchmark');

const handler = async (input, type) => {
    try {
        let start = process.hrtime();
        await engine.getResults(input);
        let stop = process.hrtime(start);

        console.log(`${type}: ${(stop[0] * 1e3 + stop[1] / 1e6).toFixed(2)}ms`);
    } catch (error) {
        console.log(error);
    }
};

const cases = {
    'best case': 'a',
    'worst case': 'ỹ',
};

for (const key in cases) {
    handler(cases[key], key);
}
