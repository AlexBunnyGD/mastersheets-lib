function fetchFromDamageIncApi(link, apiKey) {
  // console.log("[Event Schedule] Getting Data...")
  // console.log("[Event Schedule] " + link)

  const headers = {
    'X-ApiKey': apiKey
  }
  const options = {
    'method': 'get',
    'headers': headers
  };

  // console.log("[Event Schedule] Fetching...")
  const response = UrlFetchApp.fetch(link, options);
  // console.log("[Event Schedule] Done!")

  //const content = response.getContentText();
    //// console.log('Server response:', content);

  let data = response.getContentText();
  // console.log("[Event Schedule] Parsing to JSON...")

  let parsedData = JSON.parse(data);
  // console.log("[Event Schedule] Done!")

  // Get the max page from the metadata of the response
  const totalPages = parsedData.meta.totalPages;

  // Initialize an empty array to store the concatenated results
  let allResults = [];

  // console.log("[Event Schedule] Combing through Pages...")

  // Concatenate the results for the first page to the allResults array
  allResults = allResults.concat(parsedData.data);

  // Loop through all the remaining pages and fetch the data
  for (var page = 2; page <= totalPages; page++) {
    // Replace the page number in the API URL with the current page number
    let apiUrlWithPage = link.replace(/(page=)\d+/, "$1" + page);

    // Fetch the data for the current page
    let response = UrlFetchApp.fetch(apiUrlWithPage, options);
    let data = response.getContentText();
    let parsedData = JSON.parse(data);

    // Concatenate the results for the current page to the allResults array
    allResults = allResults.concat(parsedData.data);
  }
  // console.log("[Event Schedule] Done!")

  return allResults
}

function getHosts(divSheet) {
  // console.log("[Event Schedule] Getting Hosts...")

  var searchValues = ["Active"]; // replace with an array of search values
  var data = divSheet.getDataRange().getValues();
  var colLIndex = 49; // the index of column X (49 because columns are 0-indexed)
  var colAIndex = 0; // the index of column A
  var colAValues = [];
  
  for (var i = 1; i < data.length; i++) {
    if (searchValues.indexOf(data[i][colLIndex]) !== -1) {
      var intValue = Math.floor(data[i][colAIndex]);
      colAValues.push(intValue.toString().split(".")[0]);
    }
  }
  // console.log("[Event Schedule] Done!")

  return colAValues;
}

function seperateDateandTime(dateString) {
  /* Only works if these values are YYYY-MM-DD HH:MM:SS.MMMZ
    2022: Year
    12: Month (December)
    05: Day
    T: Separator between date and time
    21: Hour (in 24-hour format)
    00: Minute
    00: Second
    .000: Milliseconds (zero in this case)
    Z: Time zone offset (UTC)
  */

  var year = dateString.slice(0, 4);
  var month = dateString.slice(5, 7);
  var day = dateString.slice(8, 10);
  var hour = dateString.slice(11, 13);
  var minute = dateString.slice(14, 16);

  var dateTime = day + "/" + month + "/" + year + " " + hour + ":" + minute;

  return dateTime;
}

function importEvents(divSheet, csvEventSheet, apiKey) { 
  let today = new Date();
  const startDate = new Date(today.getTime() - (21 * 24 * 60 * 60 * 1000)).toISOString().substring(0, 10);
  const endDate = new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000)).toISOString().substring(0, 10);

  const staff = getHosts(divSheet);

  let apiUrl = `https://api.kuber.dmginc.gg/v3/emt/events/all?page=1&filter.start_date=%24gte%3A${startDate}&filter.end_date=%24lte%3A${endDate}&filter.host_id=%24in%3A`;

  for (var i = 0; i < staff.length; i++) {
    apiUrl += staff[i];
    
    if (i < staff.length - 1) {
      apiUrl += "%2C";
    }
  }

  const data = fetchFromDamageIncApi(apiUrl, apiKey);

  if (data !== null && data.length !== 0) {
    csvEventSheet.getRange(2, 1, csvEventSheet.getLastRow() - 1, 9).clearContent();

    let counter = 1;

    data.forEach(function(userData) {
      let event_id = userData.event_id;
      let emt_id = userData.log_id;
      let host_id = userData.host_id;
      let type = userData.type;
      let game = userData.game;
      let title = userData.title;
      let start_date = seperateDateandTime(userData.start_date);
      let end_date = seperateDateandTime(userData.end_date);
      let cancelled = userData.cancelled;

      let event_hyperlink = '=HYPERLINK("https://dmginc.gg/events/' + event_id + '","Event")';
      let emt_hyperlink = '=HYPERLINK("https://emt.dmginc.gg/log/' + emt_id + '","EMT")';

      csvEventSheet.getRange(counter + 1, 1, 1, 9).setValues([[event_hyperlink, emt_hyperlink, type, game, title, start_date, end_date, cancelled, host_id]]);
      counter++;
    });
  } else {
    throw new Error("Event CSV not updated due to no data!");
  }
}

  
