export const validateDate = (date: string) => {
  var dateformat = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

  if (date.match(dateformat)) {
    let operator = date.split('/');

    let datepart: string[] = [];
    if (operator.length > 1) {
      datepart = date.split('/');
    }
    let day = parseInt(datepart[2]);
    let month = parseInt(datepart[1]);
    let year = parseInt(datepart[0]);

    let ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month == 1 || month > 2) {
      if (day > ListofDays[month - 1]) {
        return false;
      }
    } else if (month == 2) {
      let leapYear = false;
      if ((!(year % 4) && year % 100) || !(year % 400)) leapYear = true;
      if (leapYear == false && day >= 29) {
        return false;
      } else if (leapYear == true && day > 29) {
        return false;
      }
    }
  } else {
    return false;
  }
  return true;
};
