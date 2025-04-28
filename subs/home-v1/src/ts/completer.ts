// non-empty list, really
export type Completions = {
  readonly first: string;
  readonly rest: string[];
};

export function init(words: string[], prefix: string): Completions {
  const matches = words.filter((word) => word.startsWith(prefix));
  const [first, ...rest] = matches;
  if (first === undefined) {
    return {first: prefix, rest: []};
  }
  const commonPrefix = findCommonPrefix(first, rest);
  if (matches.includes(commonPrefix)) {
    return {first, rest};
  }
  return {first, rest: rest.concat(commonPrefix)};
}

export function cycle(completions: Completions): [string, Completions] {
  const [first, ...rest] = completions.rest;
  if (first === undefined) {
    return [completions.first, completions];
  }
  return [completions.first, {first: first, rest: rest.concat(completions.first)}];
}

export function findCommonPrefix(firstWord: string, words: string[]): string {
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
