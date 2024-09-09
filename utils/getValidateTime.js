
export const getValidateTime = (dateString) => {
  let regExpTime = /^(\w+?\s\w+?\s\d{2}\s\d{4})\s(\d{2}:\d{2}:\d{2})\s/;
  let result = regExpTime.exec(dateString);
  if (result) return { date: result[1], time: result[2]};
}