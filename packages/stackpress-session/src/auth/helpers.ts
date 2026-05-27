/**
 * Normalize phone input
 */
export function normalizePhone(phone: string) {
  //trim the input first so empty submissions stop before cleanup work
  const trimmed = phone.trim();
  //keep optional phone fields unset when the request did not send a 
  // value.
  if (!trimmed) {
    return undefined;
  }
  //preserve one leading plus while stripping the separators users tend 
  // to type.
  const normalized = trimmed
    .replace(/(?!^\+)[^\d]/g, '')
    .replace(/\++/g, '+');
  //reject anything that no longer looks like a real number after cleanup
  return /\d/.test(normalized) ? normalized : undefined;
}
