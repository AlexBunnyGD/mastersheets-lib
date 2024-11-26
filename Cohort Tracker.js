function updateCohortTracker(divSheet, cohortTracker, csvHeaders) {
  const div = divSheet.getDataRange().getValues();

  // Only Initiates
  const onlyInitiates = ['rank', 'Initiate'];
  const filterInitiates = ArrayLib.filterByText(div, csvHeaders.indexOf("rank"), onlyInitiates);
  
  // Transpose table so we can filter columns
  const tr = ArrayLib.transpose(filterInitiates);

  // Filter columns
  const relevantCols = ['name', 'joined', 'cohort', 'posts', 'rep', 'rep_tm', 'rep_lm', 'attended_event_count_tm', 'attended_event_count_lm', 'discord_secs_tm', 'discord_secs_lm'];
  const gi = ArrayLib.filterByText(tr, 0, relevantCols);

  // Transpose back
  let cohortTrackerArray = ArrayLib.transpose(gi);

  // Rearrange columns
  cohortTrackerArray = rearrangeCols( cohortTrackerArray, [0,4,3,2,1,5,6,7,8,9,10])

  // let ready = cohortTrackerData(cohortTrackerArray);
  let ready = cohortTrackerArray;
  ready.shift();
 
  // Write data on General info
  cohortTracker.getRange(2, 2, cohortTracker.getLastRow(), 11).clearContent();
  cohortTracker.getRange(2, 2, ready.length, ready[0].length).setValues(ready);
}

// Activity based on Teams & Rosters
function cohortTrackerData( div ) {
  const rankCol = 10;

  // div array
  let divGI = [];

  // Members - Initiate
  let divInitiate = [];
  let divTMInitiate = ArrayLib.filterByText( div, rankCol, 'Initiate' );
  
  if ( divTMInitiate.length > 0 ) {
    for ( let i = 0; i < divTMInitiate.length; i++ ) {
      divInitiate.push( divTMInitiate[i] );
    }
  }

  // Add members array to div array
  divGI = divGI.concat( divInitiate );

  return divGI;
}