function importCSV(sheetID, division, apiKey) {
  const ss = SpreadsheetApp.openById(sheetID);
  const overview = ss.getSheetByName('Overview');
  const initiateLog = ss.getSheetByName('Initiate Log');
  const inactiveLog = ss.getSheetByName('Inactive Log');
  const memberLog = ss.getSheetByName('Member Log');
  const mdr = ss.getSheetByName('MDR');
  const cohortTracker = ss.getSheetByName('Cohort Tracker');
  const activity = ss.getSheetByName('Activity');
  const activityCheck = ss.getSheetByName('Activity Check');
  const dropsSheet = ss.getSheetByName('10 Day Drops');
  const csvEventSheet = ss.getSheetByName('EventCSV');
  const csvSheet = ss.getSheetByName('FullCSV');
  const divSheet = ss.getSheetByName('CSV');
  const backupSheet = ss.getSheetByName('BackupCSV');
  var csvHeaders = backupSheet.getDataRange().getValues()[0];
  const noInactives = ['rank','L6','L5','L4','L3','Elite','Veteran','Senior','Member','Initiate','Away','Probation'];

  // Get csv
  let today = Utilities.formatDate(new Date(), "EST", "yyyy/MM/dd");
  let csvUrl = "https://api.dmginc.gg/v3/csv/download/" + today;

  // Set API Key Headers
  const headers = {
    'X-ApiKey': apiKey
  }
  const options = {
    'method': 'get',
    'headers': headers
  };

  // Check Error if yes then change date to yesterday
  try {
    UrlFetchApp.fetch(csvUrl, options).getResponseCode();
  }
  catch (err) {
    let todays = new Date();
    let yesterday = new Date(new Date().setDate(todays.getDate() - 1));
    today = Utilities.formatDate(yesterday, "EST", "yyyy/MM/dd");
    csvUrl = "https://api.dmginc.gg/v3/csv/download/" + today;
  }
  const csvContent = UrlFetchApp.fetch(csvUrl, options).getContentText();
  const csvData = Utilities.parseCsv(csvContent);
  
  // Get only div data
  const div = relevantData(csvData, csvHeaders.indexOf("division"), division);
  
  // Save last join date for initiate log
  let joinDates = divSheet.getRange('BD2:BD').getValues();
  const lastJoinDate = new Date(Math.max.apply(null, joinDates.flat()));

  // Write data on CSV sheet
  csvSheet.clear();
  csvSheet.getRange(1, 1, csvData.length, csvData[0].length).setValues(csvData);

  // Write backup if current sheet isn't broken
  if (!csvSheet.getRange(2, 1, 1, 1).isBlank()) {
    backupSheet.clear();
    backupSheet.getRange(1, 1, csvData.length, csvData[0].length).setValues(csvData);
    updateLastExecutionTime(overview);
  }
  
  // Write division data if CSV was successful
  if(!csvSheet.getRange(2, 1, 1, 1).isBlank()) {
    divSheet.clear();
    divSheet.getRange(1, 1, div.length, div[0].length).setValues(div);
    divSheet.getRange('V2:V').setNumberFormat('@');
    divSheet.getRange('V2:V').setNumberFormat('yyyy-mm-dd HH:mm');
    deleteBlankRows(divSheet);
  }

  // Change Discord mixed format to date
  csvSheet.getRange('V2:V').setNumberFormat('@');
  backupSheet.getRange('V2:V').setNumberFormat('@');
  csvSheet.getRange('V2:V').setNumberFormat('yyyy-mm-dd HH:mm');
  backupSheet.getRange('V2:V').setNumberFormat('yyyy-mm-dd HH:mm');
  
  deleteBlankRows(csvSheet);
  deleteBlankRows(backupSheet);

  // Update automated sheets as well
  let errors = [];

  Logger.log("Updating MDR...");
  try {
    updateMDR(divSheet, mdr, noInactives, csvHeaders);
  } catch (err) {
    errors.push(["MDR", err]);
  }

  Logger.log("Updating Activity Check...");
  try {
    updateActivityCheck(activityCheck, activity);
  } catch (err) {
    errors.push(["Activity Check", err]);
  }

  Logger.log("Updating Initiate Log..."); 
  try {
    updateInitiateLog(divSheet, initiateLog, inactiveLog, memberLog, lastJoinDate);
  } catch (err) {
    errors.push(["Initiate Log", err]);
  }

  Logger.log("Updating 10 Day Drops..."); 
  try {
    updateDrops(divSheet, dropsSheet, csvHeaders);
  } catch (err) {
    errors.push(["10 Day Drops", err]);
  }

  Logger.log("Updating Activity..."); 
  try {
    updateActivity(divSheet, activity, noInactives, csvHeaders);
  } catch (err) {
    errors.push(["Activity", err]);
  }

  Logger.log("Updating Cohort Tracker..."); 
  try {
    updateCohortTracker(divSheet, cohortTracker, csvHeaders);
  } catch (err) {
    errors.push(["Cohort Tracker", err]);
  }

  Logger.log("Updating Event Schedule..."); 
  try {
    importEvents(divSheet, csvEventSheet, apiKey);
  } catch (err) {
    errors.push(["Event Schedule", err]);
  }

  Logger.log("Sorting Cohort PMs..."); 
  try {
    sortCohortPms(sheetID);
  } catch (err) {
    errors.push(["Cohort PMs", err]);
  }

  if (errors.length > 0) {
    let affectedSheets = "";

    for (error of errors) {
      Logger.log(`Error on ${error[0]}: ${error[1]}`);
      affectedSheets = affectedSheets + error[0] + ", ";
    }
    throw new Error(`Following sheets failed to update: ${affectedSheets}check execution logs for details.`);
  }
}

// Testing
function lmao() {
  Logger.log("lmao");
}