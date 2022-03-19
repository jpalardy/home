class Completer {
  readonly words: string[];

  constructor(words: string[]) {
    this.words = words;
  }

  *matches(prefix: string, options = {skipSameFirst: false}): Generator<string, never, unknown> {
    const results = Completer.findCompletions(prefix, this.words);
    if (options.skipSameFirst) {
      const first = results[0];
      if (results[0] === prefix) {
        results.shift();
        results.push(first); // rotate-left
      }
    }
    while (true) {
      for (let i = 0; i < results.length; i += 1) {
        yield results[i];
      }
    }
  }

  // simplify?
  static findCommonPrefix(words: string[] = []): string {
    const firstWord = words[0];
    if (words.length <= 1) {
      return firstWord || "";
    }
    for (let i = 0; i < firstWord.length; i += 1) {
      for (let j = 1; j < words.length; j += 1) {
        if (!words[j][i] || words[j][i] !== firstWord[i]) {
          return firstWord.slice(0, i);
        }
      }
    }
    // first word matched completely, all words are same
    return firstWord;
  }

  static findCompletions(prefix: string, words: string[]): string[] {
    const matches = words.filter((word) => word.startsWith(prefix));
    const commonPrefix = Completer.findCommonPrefix(matches) || prefix;
    return [...new Set([commonPrefix, ...matches])];
  }
}

export {Completer};
