// ------------------------------------------------------------
// PRE BUILD NOT INCLUDED IN BUILD
// WILL BE MOVED TO SERVERLESS EXAMPLES ONCE DONE
// ------------------------------------------------------------

const dataset = require('./data/default.json');
const datasetReco = require('./data/recommended.json');
const fs = require('fs');

class Indexer {
    indexSet = new Set();
    index = [];
    _items;
    _recommended;

    constructor() {
        const tempItems = new Set(dataset.map((item) => item.toLowerCase()).sort());

        this._items = [...tempItems];
        this._recommended = datasetReco.map((item) => item.toLowerCase());

        this.buildSortingIndex();
    }

    buildSortingIndex() {
        // create uniek index char
        for (let a = 0; a < this._items.length; a++) {
            const item = this._items[a];
            const chars = item.split('');

            for (let b = 0; b < chars.length; b++) {
                const char = chars[b];
                this.indexSet.add(char.toLowerCase());
            }
        }

        // remove non-word characters.
        [' ', '.', '-', '/', ',', '‘', '’', "'"].map((e) => this.indexSet.delete(e));

        this.index = [...this.indexSet].sort();

        console.log('Indexing set:');
        console.log(...this.index);

        this.sortItems();
    }

    sortItems() {
        const sorted = {};

        for (let a = 0; a < this.index.length; a++) {
            const char = this.index[a];
            sorted[char] = [];

            const unfilterd = this._items
                .map((item) => item)
                .filter((item) => item.includes(char))
                .filter((item) => {
                    // first word first char
                    const words = item.split(' ');

                    if (words[0] && words[0].charAt(0) === char) {
                        sorted[char].push(item);
                        return false;
                    } else return true;
                })
                .filter((item) => {
                    // second word first char
                    const words = item.split(' ');

                    if (words[1] && words[1].charAt(0) === char) {
                        sorted[char].push(item);
                        return false;
                    } else return true;
                })
                .filter((item) => {
                    // third word first char
                    const words = item.split(' ');

                    if (words[2] && words[2].charAt(0) === char) {
                        sorted[char].push(item);
                        return false;
                    } else return true;
                })
                .filter((item) => {
                    // first word any char
                    const words = item.split(' ');

                    if (words[0] && words[0].includes(char)) {
                        sorted[char].push(item);
                        return false;
                    } else return true;
                })
                .filter((item) => {
                    // second word any char
                    const words = item.split(' ');

                    if (words[1] && words[1].includes(char)) {
                        sorted[char].push(item);
                        return false;
                    } else return true;
                })
                .filter((item) => {
                    // third word any char
                    const words = item.split(' ');

                    if (words[2] && words[2].includes(char)) {
                        sorted[char].push(item);
                        return false;
                    } else return true;
                });

            if (unfilterd.length) sorted[char].push(...this.sortUnfiltedItems(char, unfilterd));
        }

        this.writeToFiles(sorted);
    }

    sortUnfiltedItems(char, items) {
        return items.sort((a, b) => {
            const i = a.indexOf(char);
            const j = b.indexOf(char);
            if (i > j) return 1;
            if (i < j) return -1;
            return 0;
        });
    }

    writeToFiles(obj) {
        const dir = './api/data';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        fs.writeFile('./api/data/sorted.json', JSON.stringify(obj), (err) => {
            if (err) return console.error(err);
        });

        fs.writeFile('./api/data/default.json', JSON.stringify(this._items), (err) => {
            if (err) return console.error(err);
        });

        fs.writeFile('./api/data/recommended.json', JSON.stringify(this._recommended), (err) => {
            if (err) return console.error(err);
        });
    }
}

new Indexer();
