'use strict';

/*!
 * suggestify-engine
 * (c) 2022 Max van der Schee
 * @license MIT
 */
class SuggestifyEngine {
  constructor({ defaultItems, sortedItems, options }) {
    this.items = [];
    this.defaultItems = defaultItems;
    this.sortedItems = sortedItems;
    this.config = {
      MIN_DISTANCE: 3,
      ITEM_CAP: 8,
      ITEM_CAP_ALT: 32,
      ...options
    };
  }
  getResults(input) {
    this.input = input;
    this.globalReg = new RegExp(input.replace(/\s+/g, "|"), "i");
    this.char = input.charAt(0);
    this.items = this.sortedItems && this.sortedItems[this.char] ? this.sortedItems[this.char] : [];
    return this.listFilter();
  }
  listFilter() {
    const list = {
      match: [],
      alt: []
    };
    const wordsMatch = (item) => {
      if (this.globalReg?.test(item))
        list["match"].push(item);
      return;
    };
    const AltMatch = (item) => {
      if (this.levenshtein(item, this.input || "") <= this.config.MIN_DISTANCE)
        list["alt"].push(item);
      return;
    };
    const reachedCapMatch = () => {
      return list["match"].length >= this.config.ITEM_CAP;
    };
    const reachedCapAlt = () => {
      return list["alt"].length >= this.config.ITEM_CAP_ALT;
    };
    const il = this.items.length;
    for (let i = 0; i < il; i++) {
      wordsMatch(this.items[i]);
      AltMatch(this.items[i]);
      if (reachedCapMatch() || reachedCapAlt())
        break;
    }
    if (!reachedCapMatch() && !reachedCapAlt()) {
      const l = this.defaultItems.length;
      for (let i = 0; i < l; i++) {
        wordsMatch(this.defaultItems[i]);
        AltMatch(this.defaultItems[i]);
        if (reachedCapMatch() || reachedCapAlt())
          break;
      }
    }
    const results = /* @__PURE__ */ new Set([
      ...this.sortResults(this.input, list["match"]),
      ...this.sortResults(this.input, list["alt"])
    ]);
    return [...results].slice(0, this.config.ITEM_CAP);
  }
  sortResults(text, items) {
    return items.sort((a, b) => {
      const i = this.levenshtein(text, a);
      const j = this.levenshtein(text, b);
      if (i > j)
        return 1;
      if (i < j)
        return -1;
      return 0;
    });
  }
  levenshtein(s, t) {
    if (!s.length)
      return t.length;
    if (!t.length)
      return s.length;
    const tl = t.length;
    const sl = s.length;
    const arr = [];
    for (let i = 0; i <= tl; i++) {
      arr[i] = [i];
      for (let j = 1; j <= sl; j++) {
        arr[i][j] = i === 0 ? j : Math.min(arr[i - 1][j] + 1, arr[i][j - 1] + 1, arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1));
      }
    }
    return arr[tl][sl];
  }
}

module.exports = SuggestifyEngine;
