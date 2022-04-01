class Completer {
  readonly words: string[];

  constructor(words: string[]) {
    this.words = words;
  }

  *matches(prefix: string, options = {skipSameFirst: false}): Generator<string, never, unknown> {
    const results = Completer.findCompletions(prefix, this.words);
    if (options.skipSameFirst) {
      const first = results[0];
      if (first === prefix) {
        results.shift();
        results.push(first); // rotate-left
      }
    }
    while (true) {
      for (const value of results) {
        yield value;
      }
    }
  }

  static findCommonPrefix(firstWord: string, words: string[]): string {
    if (words.length === 0) {
      return firstWord;
    }
    for (let i = 0; i < firstWord.length; i += 1) {
      for (const word of words) {
        if (word[i] !== firstWord[i]) {
          return firstWord.slice(0, i);
        }
      }
    }
    // first word matched completely, all words are same
    return firstWord;
  }

  static findCompletions(prefix: string, words: string[]): string[] {
    const matches = words.filter((word) => word.startsWith(prefix));
    const [first, ...rest] = matches;
    if (first === undefined) {
      return [prefix];
    }
    const commonPrefix = Completer.findCommonPrefix(first, rest);
    return [...new Set([commonPrefix, ...matches])];
  }
}

export {Completer};
