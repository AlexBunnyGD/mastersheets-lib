function updateDrops(divSheet, dropsSheet, csvHeaders) {
  let newDrops = [];

  // Get relevant CSV data
  let csvData = divSheet.getDataRange().getValues();
  let relevantCols = ['name', 'rank', 'attended_event_count_tm', 'recruits_tm', 'discord_secs_tm', 'latest_join_date'];
  let relevantColIndexes = relevantCols.map(col => csvHeaders.indexOf(col));
  let relevantData = csvData.map(row => relevantColIndexes.map(colIndex => row[colIndex]));

  // Get current drops & trim array
  let currentDrops = dropsSheet.getRange('A2:A').getValues().flat();

  while (currentDrops.length > 0 && currentDrops[currentDrops.length - 1] === '') {
    currentDrops.pop();
  }
  
  // Retrieve rows of active/dropped people
  let rowsToDelete = [];

  for (let j = 0; j < currentDrops.length; j++) {

  let isInCsv = false;  

  for (let i = 0; i < relevantData.length; i++) {
    if (relevantData[i][0] == currentDrops[j]) {
      isInCsv = true;  
      
      if (relevantData[i][1] === 'Inactive' || relevantData[i][2] > 0 || relevantData[i][3] > 0 || relevantData[i][4] >= 7200) {
        rowsToDelete.unshift(j + 2);  // Add row index to delete (j+2 based on 1-based index)
      }
    }
  }

  if (!isInCsv) {
    rowsToDelete.unshift(j + 2);  // Add row index to delete if not found
  }
}

  // Remove active/dropped people
  for (let i = 0; i < rowsToDelete.length; i++) {
    dropsSheet.deleteRow(rowsToDelete[i]);
  }

  // Get new people to add
  let duplicate = false;

  for (let i = 0; i < relevantData.length; i++) {
    if (relevantData[i][1] === 'Initiate' && relevantData[i][2] === 0 && relevantData[i][3] === 0 && relevantData[i][4] < 7200 && isRecent(relevantData[i][5])) {

      // Check if already on list
      duplicate = false;

      for (let j = 0; j < currentDrops.length; j++) {
        if (currentDrops[j] === relevantData[i][0]) {
          duplicate = true;
        }
      }

      // If not on list, add name
      if (duplicate === false) {
        newDrops.push([relevantData[i][0]]);
      }
    }
  }

  // Add new names to sheet
  let lastRow = getLastRowSpecial(dropsSheet.getRange('A2:A').getValues());

  if (newDrops.length > 0) {
    dropsSheet.getRange(lastRow + 2, 1, newDrops.length, newDrops[0].length).setValues(newDrops);

    // Sort by days left
    sortLines(dropsSheet);
  }
}

function sortLines(dropsSheet) {
  let nameAmount = getLastRowSpecial(dropsSheet.getRange('A2:A').getValues());
  let daysRange = dropsSheet.getRange(2, 7, nameAmount, 1).getValues().flat();
  let namesRange = dropsSheet.getRange(2, 1, nameAmount, 1).getValues().flat();
  let extraRange = dropsSheet.getRange(2, 10, nameAmount, 2).getValues(); // Checkbox & Notes

  // Create an array of objects with days left before drop and index
  let indexedData = daysRange.map((value, index) => ({value: value, index: index}));

  // Sort by days left & extract the sorted indexes
  indexedData.sort((a, b) => a.value - b.value);
  let sortedIndexes = indexedData.map(obj => obj.index);

  // Sort data
  let newNames = [];
  let newExtra = [];

  for (let i = 0; i < nameAmount; i++) {
    newNames[i] = [namesRange[sortedIndexes[i]]];
    newExtra[i] = extraRange[sortedIndexes[i]];
  }

  // Insert sorted data into sheet
  dropsSheet.getRange(2, 1, nameAmount, 1).setValues(newNames);
  dropsSheet.getRange(2, 10, nameAmount, 2).setValues(newExtra);
}

function isRecent(date) {
  let now = new Date();
  let tenDaysAgo = new Date();
  
  tenDaysAgo.setDate(now.getDate() - 10);

  return date >= tenDaysAgo && date <= now;
}

