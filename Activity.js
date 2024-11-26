function updateActivity(divSheet, activity, noInactives, csvHeaders) {
  const div = divSheet.getDataRange().getValues();

  // Exclude inactives
  const filterActives = ArrayLib.filterByText(div, csvHeaders.indexOf("rank"), noInactives);
  
  // Transpose table so we can filter columns
  const tr = ArrayLib.transpose(filterActives);

  // Filter columns
  const relevantCols = ['name', 'rank', 'position', 'last_forum_activity', 'last_discord_activity'];
  const gi = ArrayLib.filterByText(tr, 0, relevantCols);

  // Transpose back
  let activityArray = ArrayLib.transpose(gi);
  
  // Rearrange columns
  activityArray = rearrangeCols( activityArray, [0,3,4,2,1])

  let ready = activityData( activityArray );
  
  // Write data on General info
  activity.getRange(3, 1, activity.getLastRow(), 5).clearContent();
  activity.getRange(3, 1, ready.length, ready[0].length).setValues(ready);
}

// Activity based on Teams & Rosters
function activityData( div ) {
  const positionCol = 3;
  const rankCol = 4;

  // div array
  let divGI = [];

  // DL
  let dl = ArrayLib.filterByText( div, positionCol, 'DL' );

  if ( dl.length > 0 ) {
    for ( let i = 0; i < dl.length; i++ ) {
      divGI.push( dl[i] );
    }
  }

  // DV
  let dv = ArrayLib.filterByText( div, positionCol, 'DV' );

  if ( dv.length > 0 ) {
    for ( let i = 0; i < dv.length; i++ ) {
      divGI.push( dv[i] );
    }
  }

  // TL
  let tl = ArrayLib.filterByText( div, positionCol, 'TL' );

  if ( tl.length > 0 ) {
    for ( let i = 0; i < tl.length; i++ ) {
      divGI.push( tl[i] );
    }
  }

  // Members
  let divMembers = [];
  let divMembersTitle = ['Members',,,,,];

  divGI.push( divMembersTitle );

  // Members - L6
  let divL6 = [];
  let divTML6 = ArrayLib.filterByText( div, rankCol, 'L6' );

  if ( divTML6.length > 0 ) {
    for ( let i = 0; i < divTML6.length; i++ ) {
      if ( divTML6[i][positionCol] != 'DL' ) {
        divL6.push( divTML6[i] );
      }
    }
  }
  divMembers = divMembers.concat( divL6 );

  // Members - L5
  let divL5 = [];
  let divTML5 = ArrayLib.filterByText( div, rankCol, 'L5' );

  if ( divTML5.length > 0 ) {
    for ( let i = 0; i < divTML5.length; i++ ) {
      if ( divTML5[i][positionCol] != 'DV' ) {
        divL5.push( divTML5[i] );
      }
    }
  }
  divMembers = divMembers.concat( divL5 );

  // Members - L4
  let divL4 = [];
  let divTML4 = ArrayLib.filterByText( div, rankCol, 'L4' );

  if ( divTML4.length > 0 ) {
    for ( let i = 0; i < divTML4.length; i++ ) {
      if ( divTML4[i][positionCol] != 'TL' ) {
        divL4.push( divTML4[i] );
      }
    }
  }
  divMembers = divMembers.concat( divL4 );

  // Members - L3
  let divL3 = [];
  let divTML3 = ArrayLib.filterByText( div, rankCol, 'L3' );

  if ( divTML3.length > 0 ) {
    for ( let i = 0; i < divTML3.length; i++ ) {
      divL3.push( divTML3[i] );
    }
  }
  divMembers = divMembers.concat( divL3 );

  // Members - Elite
  let divElite = [];
  let divTMElite = ArrayLib.filterByText( div, rankCol, 'Elite' );

  if ( divTMElite.length > 0 ) {
    for ( let i = 0; i < divTMElite.length; i++ ) {
      divElite.push( divTMElite[i] );
    }
  }
  divMembers = divMembers.concat( divElite );

  // Members - Veteran
  let divVeteran = [];
  let divTMVeteran = ArrayLib.filterByText( div, rankCol, 'Veteran' );

  if ( divTMVeteran.length > 0 ) {
    for ( let i = 0; i < divTMVeteran.length; i++ ) {
      divVeteran.push( divTMVeteran[i] );
    }
  }
  divMembers = divMembers.concat( divVeteran );

  // Members - Senior
  let divSenior = [];
  let divTMSenior = ArrayLib.filterByText( div, rankCol, 'Senior' );

  if ( divTMSenior.length > 0 ) {
    for ( let i = 0; i < divTMSenior.length; i++ ) {
      divSenior.push( divTMSenior[i] );
    }
  }
  divMembers = divMembers.concat( divSenior );

  // Members - Member
  let divMember = [];
  let divTMMember = ArrayLib.filterByText( div, rankCol, 'Member' );

  if ( divTMMember.length > 0 ) {
    for ( let i = 0; i < divTMMember.length; i++ ) {
      divMember.push( divTMMember[i] );
    }
  }
  divMembers = divMembers.concat( divMember );

  // Members - Initiate
  let divInitiate = [];
  let divTMInitiate = ArrayLib.filterByText( div, rankCol, 'Initiate' );

  if ( divTMInitiate.length > 0 ) {
    for ( let i = 0; i < divTMInitiate.length; i++ ) {
      divInitiate.push( divTMInitiate[i] );
    }
  }
  divMembers = divMembers.concat( divInitiate );

  // Members - Away
  let divAway = [];
  let divTMAway = ArrayLib.filterByText( div, rankCol, 'Away' );

  if ( divTMAway.length > 0 ) {
    for ( let i = 0; i < divTMAway.length; i++ ) {
      divAway.push( divTMAway[i] );
    }
  }
  divMembers = divMembers.concat( divAway );

  // Members - Probation
  let divProbation = [];
  let divTMProbation = ArrayLib.filterByText( div, rankCol, 'Probation' );
  
  if ( divTMProbation.length > 0 ) {
    for ( let i = 0; i < divTMProbation.length; i++ ) {
      divProbation.push( divTMProbation[i] );
    }
  }
  divMembers = divMembers.concat( divProbation );
  
  // Add members array to div array
  divGI = divGI.concat( divMembers );

  return divGI;
}
