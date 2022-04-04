/*!
 * suggestify-engine
 * (c) 2022 Max van der Schee
 * @license MIT
 */
declare type Options = {
    defaultItems: string[];
    sortedItems?: {
        [key: string]: string[];
    };
    options?: {
        MIN_DISTANCE?: number;
        ITEM_CAP?: number;
        ITEM_CAP_ALT?: number;
    };
};
declare class SuggestifyEngine {
    input: string;
    defaultItems: Options['defaultItems'];
    sortedItems?: Options['sortedItems'];
    items: string[];
    config: {
        MIN_DISTANCE: number;
        ITEM_CAP: number;
        ITEM_CAP_ALT: number;
    };
    char?: string;
    globalReg?: RegExp;
    constructor({ defaultItems, sortedItems, options }: Options);
    getResults(input: string): string[];
    private listFilter;
    private sortResults;
    /**
     * levenshtein calculates the distance between
     * two strings, it's good for typo's and if the result is wanted
     * @param { string } s
     * @param { string } t
     * @returns { number } number
     */
    private levenshtein;
}

export { Options, SuggestifyEngine as default };
