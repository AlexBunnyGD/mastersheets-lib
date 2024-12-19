function updateInitiateLog(divSheet, initiateLog, inactiveLog, memberLog, last) {
  const csvContent = divSheet.getRange('A2:BD').getValues();
  let newInitiates = [];

  // Check for new Initiates and store ID
  for (let i = 0; i < csvContent.length; i++) {
    if (csvContent[i][55] > last && csvContent[i][8] == 'Initiate') {
      newInitiates.push([csvContent[i][0]]);
    }
  }

  // Find where to paste Initiates
  const firstEmptyRow = initiateLog.getRange(initiateLog.getLastRow(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow() + 1;

  // Add new Initiates
  if (newInitiates.length > 0) {
    initiateLog.getRange(firstEmptyRow, 1, newInitiates.length, 1).setValues(newInitiates);
  }

  // Sort out non-initiates
  sortLogs(initiateLog, inactiveLog, memberLog);
}

function sortLogs(initiateLog, inactiveLog, memberLog) {
  const ranks = initiateLog.getRange('C2:C').getValues();

  // Check for non-initiates
  for (let i = ranks.length - 1; i >= 0; i--) {
    // Push Inactives to Inactive Log and delete them from Initiate Log
    if (ranks[i][0] == 'Inactive' && ranks[i][0] != '') {
      let inactiveMember = initiateLog.getRange(i + 2, 1, 1, initiateLog.getLastColumn()).getValues()[0];
      inactiveLog.appendRow(inactiveMember);
      initiateLog.deleteRow(i+2);
    } 
    
    // Push Members to Member Log and delete them from Initiate Log
    else if (ranks[i][0] != 'Initiate' && ranks[i][0] != '') {
      let member = initiateLog.getRange(i + 2, 1, 1, initiateLog.getLastColumn()).getValues()[0];
      memberLog.appendRow(member);
      initiateLog.deleteRow(i+2);
    }
  }
}