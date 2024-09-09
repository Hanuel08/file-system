export const formatHours = (time) => {
  let regExpHours = /^(\d{2}):(\d{2}):(\d{2})$/;
  let result = regExpHours.exec(time.trim());

  if (result) {
    let [_, hours, minutes, seconds] = result;

    if (parseInt(hours) > 12) {
      let hours12Format = parseInt(hours) - 12;
      return `${hours12Format}:${minutes}:${seconds} pm`;
    }
    return `${hours}:${minutes}:${seconds} am`;
  }
};