function updateActivityCheck(activityCheck, activity) {
  
  const today = new Date();

  let currentInactives = activityCheck.getRange('C2:F').getValues();
  let nextrow = getLastRowSpecial(currentInactives)+2;
  
  let activityPeeps = activity.getRange('A3:E').getValues();
  let vanguardColumn = activity.getRange('H3:H').getValues().flat();
  let activityPeepsInactives = [];
  
  for (let i = 0; i < activityPeeps.length; i++) {
    let alreadyOnSheet = false;

    if (activityPeeps[i][2] != '') {
      // let lastForumActivity = Math.abs(today - activityPeeps[i][1]) / (1000 * 60 * 60 * 24);
      let lastDiscordActivity = Math.abs(today - activityPeeps[i][2]) / (1000 * 60 * 60 * 24);
      
      // check if already on sheet
      for (let j = 0; j < currentInactives.length; j++) {
        if (currentInactives[j][0] == activityPeeps[i][0]) {
          alreadyOnSheet = true;

          // Update activity
          activityCheck.getRange(j+2, 4).setValue(activityPeeps[i][2]);
          currentInactives[j][1] = activityPeeps[i][2];
        }
      }

      // check if inactive
      if (lastDiscordActivity > 7 && alreadyOnSheet == false && vanguardColumn[i] == "") {
        activityPeeps[i][3] = today;
        activityPeepsInactives.push(activityPeeps[i]);
      }
    }
  }
  removeCols(activityPeepsInactives, 4);
  removeCols(activityPeepsInactives, 1);
  
  // insert new people
  if (activityPeepsInactives.length > 0) {
    activityCheck.getRange(nextrow, 3, activityPeepsInactives.length, activityPeepsInactives[0].length).setValues(activityPeepsInactives);
  }
  
  // collect people that turned active or dropped since last check
  let rowsToDelete = [];

  for (let i = 0; i < currentInactives.length; i++) {
    let activityDifference = Math.abs(today - currentInactives[i][1]) / (1000 * 60 * 60 * 24);
    
    if (activityDifference < 7 || currentInactives[i][3] == 'Inactive') {
      rowsToDelete.push(i+2);
    }
  }
  // delete active or dropped people
  for (let i = rowsToDelete.length - 1; i >= 0; i--) {
    activityCheck.deleteRow(rowsToDelete[i]);
  }

}

