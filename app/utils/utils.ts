export const calcMonerodSyncPercentage = (height: number, targetHeight: number): number => {
  if (targetHeight > height) {
    return Number(((height / targetHeight) * 100).toFixed(1));
  }
  return 100;
};

export const calcBytesToGigabytes = (bytes: number): number => bytes * 0.000000001;
