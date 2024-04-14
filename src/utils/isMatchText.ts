/**
 * @param inputText
 * @param conditionText Wildcard * が指定可能
 * @returns
 */
export function isMatchText(inputText: string, conditionText: string): boolean {
  const regexSafeText = conditionText.replace(/[-[\]/{}()+?.\\^$|]/g, "\\$&");
  const regexPattern = regexSafeText.replace(/\*/g, ".*");
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(inputText);
}
