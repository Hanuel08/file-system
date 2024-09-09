export class ConvertDate {

  static monthToNumber(month) {
    //if (number > 12 || number < 1) return;
    
    let months = {
      jan: 1,
      feb: 2,
      mar: 3,
      apr: 4,
      may: 5,
      jun: 6,
      jul: 7,
      aug: 8,
      sep: 9,
      oct: 10,
      nov: 11,
      dec: 12,
    };

    return months[month];
  }

  static monthToString(month) {
    
    if (typeof month == 'number' && (month < 12 && month >= 1)) {
      let months = {
        1: "january",
        2: "february",
        3: "march",
        4: "april",
        5: "may",
        6: "june",
        7: "july",
        8: "august",
        9: "september",
        10: "october",
        11: 'november',
        12: 'december',
      };

      return months[month];
    } else if (typeof month == 'string') {
      let months = {
        jan: "january",
        feb: "february",
        mar: "march",
        apr: "april",
        may: "may",
        jun: "june",
        jul: "july",
        aug: "august",
        sep: "september",
        oct: "october",
        nov: "november",
        dec: "december",
      };

      return months[month];
    }

    return;
  }

  static dayToNumber(month) {
    //if (number > 7 && number < 1) return;
    let days = {
      mon: "01",
      tue: "02",
      wed: "03",
      thu: "04",
      fri: "05",
      sat: "06",
      sun: "07",
    }; 

    return days[month];
  }

  static dayToString(day) {
    if (typeof day == 'number' && (day < 12 && day >= 1)) {
      let days = {
        "01": "monday",
        "02": "tuesday",
        "03": "wednesday",
        "04": "thursday",
        "05": "friday",
        "06": "saturday",
        "07": "sunday"
      }

      return days[day];
    } else if (typeof day == 'string') {
      let days = {
        mon: "monday",
        tue: "tuesday",
        wed: "wednesday",
        thu: "thursday",
        fri: "friday",
        sat: "saturday",
        sun: "sunday",
      };
      return days[day];
    }
    
    return;
  }

}