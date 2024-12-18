function updateMastersheet(sheetID, division, apiKey) {
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

  // Import csv and get last join date from csv data
  const lastJoinDate = importCSV(apiKey, division, divSheet, csvSheet, backupSheet, overview, csvHeaders);

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
