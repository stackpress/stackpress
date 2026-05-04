export function getArticle(word: string|null, capitalize = false) {
  if (!word) return '';
  const silentH = ['hour', 'hourly', 'honor', 'honorable', 'honest', 'hour'];
  const startsWithVowelSound = /^[aeiou]/i.test(word) && !/^u[bcdfghjklmnpqrstvwxyz]/i.test(word);
  const startsWithSilentH = silentH.includes(word.toLowerCase());

  if (startsWithVowelSound || startsWithSilentH) {
    return capitalize ? 'An ' + word : 'an ' + word;
  } else {
    return capitalize ? 'A ' + word : 'a ' + word;
  }
};