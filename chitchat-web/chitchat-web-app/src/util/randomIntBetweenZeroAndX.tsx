export const randomIntBetweenZeroAndXButNotY = (
  X: number,
  Y: number,
): number => {
  let num = Math.floor(Math.random() * X);
  while (num === Y) {
    num = Math.floor(Math.random() * X);
  }
  return num;
};
