// Gets the last row number based on a selected column range values 
function getLastRowSpecial(range){
  let rowNum = 0;
  let blank = false;

  for(let row = 0; row < range.length; row++){
 
    if(range[row][0] === "" && !blank){
      rowNum = row;
      blank = true;
 
    }
    else if(range[row][0] !== ""){
      blank = false;
    };
  };

  return rowNum;
}

// Only Relevant Data (for CSV)
function relevantData( csvData, csvCol, divName ) {
  let div = [];

  div.push(csvData[0]);

  for ( let row = 1; row < csvData.length; row++) {
    if ( csvData[row][csvCol] == divName ) {
      div.push( csvData[row] );
    }
  }

  return div;
}

// Replace data
function replaceData( sheetID, sheet, almost_range, to_replace, replace_with ) {
  const range = SpreadsheetApp.openById(sheetID).getSheetByName(sheet).getRange(almost_range);
  let data = range.getValues();

  let oldValue = "";
  let newValue = "";
  
  for ( let row = 0; row < data.length; row++) {
    for ( let item = 0; item < data[row].length; item++) {
      oldValue = data[row][item];
      newValue = data[row][item].replace(to_replace, replace_with);

      if ( oldValue != newValue ) {
        data[row][item] = newValue;
      }
    }
  }
  range.setValues(data);
}

// Swap Array Cols
function swapColumns( arr, x, y ) {
  for( let row = 0; row < arr.length; row++) {
    let tmp = arr[row].splice( x, 1 );
    arr[row].splice( y, 0, tmp[0] );
  }
  return arr;
}

// Rearrange array by columns
function rearrangeCols(arr, pos) {
  return arr.map(function(cols) {
    return pos.map(function(i) {
      return cols[i];
    });
  });
}

// Remove Columns
function removeCols( arr2d, colIndex ) {
  for ( let i = 0; i < arr2d.length; i++ ) {
    let row = arr2d[i];
    row.splice( colIndex, 1 );
  }
}

// Delete blank rows
function deleteBlankRows( sheet ) {
  lastrow = sheet.getLastRow();
  maxrow = sheet.getMaxRows();
  
  if ( lastrow < maxrow ) {
    sheet.deleteRows( lastrow+1, maxrow-lastrow );
  }
}