
class Completer {
  constructor(words) {
    this.words = words;
    this.completions = [];
  }

  next(prefix) {
    // currently cycling
    if (this.completions.length > 0) {
      const i = this.completions.indexOf(prefix);
      const n = this.completions.length;
      return this.completions[(i + 1) % n];
    }
    // new word
    this.completions = this.words.filter(word => word.indexOf(prefix) === 0 && word !== prefix);
    // no completions...
    if (this.completions.length === 0) {
      return prefix;
    }
    this.completions.push(prefix); // add original word to the end
    return this.completions[0];
  }

  reset() {
    this.completions = [];
  }
}

module.exports = Completer;
