function importCSV(apiKey, division, divSheet, csvSheet, backupSheet, overview, csvHeaders) {

    // Set csv parameters
    let today = Utilities.formatDate(new Date(), "EST", "yyyy/MM/dd");
    let csvUrl = "https://api.kuber.dmginc.gg/v3/csv/download/" + today;
    const options = {
      'method': 'get',
      'headers': {
        'X-ApiKey': apiKey
      }
    };
  
    let response;
  
    // Retry up to 3 times if error is 500 or 502
    for (let i = 0; i < 3; i++) {
      try {
        Logger.log(`Importing CSV... (Try ${i + 1} out of 3)`)
        response = UrlFetchApp.fetch(csvUrl, options);
        break;
      } catch (err) {
        if (err.message.match(/(returned code 500|returned code 502)/) === null) {
          throw err;
        }
        Logger.log('Import failed');
      }
      // Throw error if 3rd retry failed
      if (i === 2) {
        throw new Error('CSV import failed, please try again or wait a bit');
      }
    }
    Logger.log('CSV imported successfully');
  
    // Get csv data
    const csvContent = response.getContentText();
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
  
    return lastJoinDate;
  }
  