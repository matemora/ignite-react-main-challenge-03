export function calculateEstimatedReadingTime(content: string[]) {
  const wordCount = content.reduce((acc, curr) => acc + curr.split(' ').length, 0);
  return Math.ceil(wordCount/200);
}
