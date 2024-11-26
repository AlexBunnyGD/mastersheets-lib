function updateMDR(divSheet, mdr, noInactives, csvHeaders) {
  // Get all data from CSV sheet
  const div = divSheet.getDataRange().getValues();
  
  // Exclude inactive members
  const filterActives = ArrayLib.filterByText(div, csvHeaders.indexOf("rank"), noInactives);
  
  // Filter columns to only keep relevant ones
  const relevantCols = ['id', 'name', 'country', 'rank', 'position', 'posts', 'rep', 'discord_secs_tm', 'rep_tm', 'rep_lm', 'casual_event_secs_tm', 'casual_event_secs_lm', 'coach_event_secs_tm', 'coach_event_secs_lm', 'community_event_secs_tm', 'community_event_secs_lm', 'comp_event_secs_tm', 'comp_event_secs_lm', 'leadership_event_secs_tm', 'leadership_event_secs_lm', 'training_event_secs_tm', 'training_event_secs_lm', 'twitch_event_secs_tm', 'twitch_event_secs_lm', 'recruits_tm', 'recruits_lm',  'discord_secs_lm'];
  
  // Get the indexes of the relevant columns
  const relevantColIndexes = relevantCols.map(col => csvHeaders.indexOf(col));
  
  // Filter the data to only include the relevant columns
  const gi = filterActives.map(row => relevantColIndexes.map(colIndex => row[colIndex]));
  
  // Add total event columns and rearrange array
  let mdrArray = getTotalEvents(gi);
  mdrArray = convertDiscordHours(mdrArray);
  mdrArray = rearrangeCols(mdrArray, [2,0,1,6,5,8,9,27,28,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,7,26,4,3]);  

  // Format data for MDR sheet
  let ready = mdrData(mdrArray);
  
  // Clear previous data from MDR sheet and write new data
  mdr.getRange(3, 2, mdr.getLastRow(), 29).clearContent();
  mdr.getRange(3, 2, ready.length, ready[0].length).setValues(ready);
  
  // Change number format to automatic
  mdr.getDataRange().setNumberFormat('0');
}

// Overview based on Teams & Rosters
function mdrData( div ) {
  const positionCol = 27;
  const rankCol = 28;
  // div array
  let divGI = [];

  // DL
  let dc = ArrayLib.filterByText( div, positionCol, 'DL' );

  if ( dc.length > 0 ) {
    for ( let i = 0; i < dc.length; i++ ) {
      divGI.push( dc[i] );
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
  let divMembersTitle = [,,'Members',,,,,,,,,,,,,,,,,,,,,,,,,,,];

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
      if ( divTML3[i][positionCol] != 'TL' ) {
        divL3.push( divTML3[i] );
      }
    }
  }
  divMembers = divMembers.concat( divL3 );

  // Members - Vanguard
  let divVanguard = [];
  let divTMVanguard = ArrayLib.filterByText( div, rankCol, 'Vanguard' );

  if ( divTMVanguard.length > 0 ) {
    for ( let i = 0; i < divTMVanguard.length; i++ ) {
      divVanguard.push( divTMVanguard[i] );
    }
  }
  divMembers = divMembers.concat( divVanguard );

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

function convertDiscordHours(div) {
  const discord_tm_col =  7;
  const discord_lm_col =  26;

  for (let i = 0; i < div.length; i++) {
    div[i][discord_tm_col] = div[i][discord_tm_col]/3600
    div[i][discord_lm_col] = div[i][discord_lm_col]/3600
  }

  return div
}

// Get total events (from different event types) and convert seconTL to hours
function getTotalEvents( div ) {
  const total_events_tm = div[0].length;
  const total_events_lm = total_events_tm+1;
  const casual_col = 10;
  const coach_col = 12;
  const community_col = 14;
  const comp_col = 16;
  const leadership_col = 18;
  const training_col = 20;
  const twitch_col = 22;

  for ( let i = 0; i < div.length; i++ ) {
    // add all event types into one
    div[i][total_events_tm] = div[i][casual_col] + div[i][coach_col] + div[i][community_col] + div[i][comp_col] + div[i][leadership_col] + div[i][training_col] + div[i][twitch_col]

    // same for last month
    div[i][total_events_lm] = div[i][casual_col+1] + div[i][coach_col+1] + div[i][community_col+1] + div[i][comp_col+1] + div[i][leadership_col+1] + div[i][training_col+1] + div[i][twitch_col+1]

    // turn secs into hours
    div[i][total_events_tm] = div[i][total_events_tm]/3600
    div[i][total_events_lm] = div[i][total_events_lm]/3600

    // same for event types
    div[i][casual_col] = div[i][casual_col]/3600
    div[i][casual_col+1] = div[i][casual_col+1]/3600
    div[i][coach_col] = div[i][coach_col]/3600
    div[i][coach_col+1] = div[i][coach_col+1]/3600
    div[i][community_col] = div[i][community_col]/3600
    div[i][community_col+1] = div[i][community_col+1]/3600
    div[i][comp_col] = div[i][comp_col]/3600
    div[i][comp_col+1] = div[i][comp_col+1]/3600
    div[i][leadership_col] = div[i][leadership_col]/3600
    div[i][leadership_col+1] = div[i][leadership_col+1]/3600
    div[i][training_col] = div[i][training_col]/3600
    div[i][training_col+1] = div[i][training_col+1]/3600
    div[i][twitch_col] = div[i][twitch_col]/3600
    div[i][twitch_col+1] = div[i][twitch_col+1]/3600
  }
  
  return div
}