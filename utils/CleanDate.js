import { getValidateTime } from "./getValidateTime.js";
//import { monthToNumber } from "./monthToNumber.js";
import { ConvertDate } from "../helpers/convertDate.js";
import { formatHours } from "./formatHours.js";


export class CleanDate {
  static shortFormat(dateString) {
    let { date, time } = getValidateTime(dateString);
    let [_, monthString, dayNumber, yearNumber] = date.split(' ');

    let monthNumber = ConvertDate.monthToNumber(monthString.toLowerCase());

    return `${dayNumber}/${monthNumber}/${yearNumber} ${formatHours(time)}`
  }
  
  static largeFormat(dateString) {
    let { date, time } = getValidateTime(dateString);
    let [dayString, monthString, dayNumber, yearNumber] = date.split(" ");

    let day = ConvertDate.dayToString(dayString.toLowerCase());
    let month = ConvertDate.monthToString(monthString.toLowerCase());

    //Monday, July 29, 2024 11:39:41 a.m. m.
    return `${day}, ${month} ${dayNumber}, ${yearNumber}, ${formatHours(time)}`;
  }

}


