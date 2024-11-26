function updateLastExecutionTime(overview) {
  const timezones = [
    { timeZone: "America/New_York", abbreviation: "EST" },
    { timeZone: "Europe/London", abbreviation: "GMT" },
    { timeZone: "Europe/Berlin", abbreviation: "CET" },
  ];

  const timezoneCells = ["N5", "N6", "N7"];
  const executionTimeCells = ["O5", "O6", "O7"];

  for (let i = 0; i < timezones.length; i++) {
    const timezoneData = timezones[i];
    const date = new Date();
    const timeZone = timezoneData.timeZone;
    const abbreviation = timezoneData.abbreviation;
    const isDaylightSavingTime = isDaylightSavingTimeInTimeZone(date, timeZone);
    const timezoneOffset = isDaylightSavingTime ? 2 : 1;
    const todayUpdateTime = Utilities.formatDate(date, timeZone, "MMM d, hh:mm aa");
    const timezoneCell = overview.getRange(timezoneCells[i]);
    const executionTimeCell = overview.getRange(executionTimeCells[i]);
    timezoneCell.setValue(abbreviation);
    executionTimeCell.mergeAcross().setValue(todayUpdateTime);
  }
}

function isDaylightSavingTimeInTimeZone(date, timeZone) {
  const dateInTimeZone = Utilities.formatDate(date, timeZone, "yyyy-MM-dd HH:mm:ss");
  const formattedDate = new Date(dateInTimeZone);
  const januaryDate = new Date(formattedDate.getFullYear(), 0, 1);
  const julyDate = new Date(formattedDate.getFullYear(), 6, 1);

  return (
    formattedDate.getTimezoneOffset() !==
    Math.max(januaryDate.getTimezoneOffset(), julyDate.getTimezoneOffset())
  );
}

function calculateTimeDifferenceInTimeZone(currentTime, timeZoneCell) {
  const timeZone = timeZoneCell.getValue();
  const timeZoneOffsetInMinutes = new Date(timeZone).getTimezoneOffset();
  const currentTimeInTimeZone = new Date(currentTime - timeZoneOffsetInMinutes * 60 * 1000);
  const timeDifference = currentTimeInTimeZone - new Date(timeZoneCell.offset(0, 1).getValue());
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  
  return hours + " hours and " + minutes + " minutes ago";
}