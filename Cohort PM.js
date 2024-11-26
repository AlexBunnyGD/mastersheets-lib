function updateCohortPMs(sheetID) {
  const ss = SpreadsheetApp.openById(sheetID);
  const divSheet = ss.getSheetByName('CSV');
  const cohortPMsSheet = ss.getSheetByName('Cohort PMs');

  const ui = SpreadsheetApp.getUi();
  const response = ui.alert("Confirmation", "This will delete all screenshots and replace all names with people from the new cohort on the 'Cohort PMs' sheet. This function is only intended to be used by vices and above. Are you sure you want to proceed?", ui.ButtonSet.YES_NO);

  if (response == ui.Button.YES) {
    const dataRange = divSheet.getDataRange();
    const dataValues = dataRange.getValues();

    const filterColumnIndex = 4; // E = 4
    const columnMapping = {
      "Manager": 16,
      "Name": 1,
      "Discord Tag": 52,
      "Joined": 55,
      "Cohort": 4,
      "startCohort": "",
      "midCohort": "",
      "endCohort": false,
      "Rank": 8,
    };

    const filteredData = [];
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);

    for (let i = 1; i < dataValues.length; i++) {
      const row = dataValues[i];
      const cellDate = new Date(row[filterColumnIndex]);

      if (cellDate >= startDate && cellDate < new Date(today.getFullYear(), today.getMonth() + 1, 1)) {
        const filteredRow = Object.values(columnMapping).map(colIndex => row[colIndex]);
        filteredData.push(filteredRow);
      }
    }

    cohortPMsSheet.getRange(2, 1, cohortPMsSheet.getMaxRows() - 1, 9).clearContent();

    if (filteredData.length > 0) {
      cohortPMsSheet.getRange(2, 1, filteredData.length, filteredData[0].length).setValues(filteredData);
    }
  }
  sortCohortPms(sheetID);
}

function sortCohortPms(sheetID) {
  const cohortPMsSheet = SpreadsheetApp.openById(sheetID).getSheetByName('Cohort PMs');

  const dataRange = cohortPMsSheet.getDataRange();
  const dataValues = dataRange.getValues();

  const desiredOrder = ['Initiate', 'Away', 'L6', 'L5', 'L4', 'L3', 'Vanguard', 'Veteran', 'Senior', 'Member', 'Probation', 'Inactive'];

  // Create a mapping from status to order index
  const statusOrderMap = desiredOrder.reduce((map, status, index) => {
    map[status] = index;

    return map;
  }, {});

  // Sort the data based on the status order and then by the third column from lowest to highest
  const sortedData = dataValues.slice(1).sort((a, b) => {
    const statusA = a[8];
    const statusB = b[8];
    const indexA = statusOrderMap[statusA] !== undefined ? statusOrderMap[statusA] : desiredOrder.length;
    const indexB = statusOrderMap[statusB] !== undefined ? statusOrderMap[statusB] : desiredOrder.length;
    
    if (indexA !== indexB) {
      return indexA - indexB;
    } else {
      return a[3] - b[3]; // Sort by the third column (index 3) from lowest to highest
    }
  });

  // Clear the existing data and set the sorted data
  cohortPMsSheet.getRange(2, 1, cohortPMsSheet.getMaxRows() - 1, dataValues[0].length).clearContent();

  if (sortedData.length > 0) {
    cohortPMsSheet.getRange(2, 1, sortedData.length, sortedData[0].length).setValues(sortedData);
  }
}