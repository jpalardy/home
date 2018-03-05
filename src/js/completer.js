class Completer {
  constructor(words) {
    this.words = words;
    this.completions = [];
  }

  *matches(prefix) {
    const results = Completer.findCompletions(prefix, this.words);
    while (true) {
      for (let i = 0; i < results.length; i += 1) {
        yield results[i];
      }
    }
  }

  //-------------------------------------------------

  static findCommonPrefix(words = []) {
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

  static findCompletions(prefix, words) {
    const matches = words.filter(word => word.startsWith(prefix));
    const commonPrefix = Completer.findCommonPrefix(matches) || prefix;
    return [...new Set([commonPrefix, ...matches])];
  }
}

module.exports = Completer;
