export const createSize = (bytes) => {
  if (bytes > Math.pow(2, 30))
    return `${Math.ceil(bytes / Math.pow(2, 30))} GB`;
  else if (bytes >= 1024 * 1000)
    return `${Math.ceil(bytes / (1024 * 1000))} MB`;
  else if (bytes >= 1024) return `${Math.ceil(bytes / 1024)} KB`;
  else return `${Math.ceil(bytes)} B`;
};