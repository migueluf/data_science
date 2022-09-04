function importAirtableData(){
  let data = getAllRecords();
  let sheet_data = []

  sheet_data.push(['ID', 'Empresa'])
  for(let i = 0; i< data.length; i++){
    let fields = data[i].fields;
    sheet_data.push([
      data[i].id,
      fields.Empresa,      

    ])
  }
  const ss = SpreadsheetApp.openById('ID Google Sheets');
  const sheet = ss.getSheetByName('Base');
  sheet.getDataRange().clearContent();
  const range = sheet.getRange(1, 1, sheet_data.length, sheet_data[0].length);
  range.setValues(sheet_data);
}

function getAllRecords(){
  const url = 'Url base de dados AirTable'
  let records = [];
  const innitial_response = requestAirtableData(url);
  records.push(innitial_response.records);
  let offset = innitial_response.offset;
  if(offset!== undefined){
    do{
      const response = requestAirtableData(url, offset)
      records.push(response.records)
      offset = response.offset
    }while (offset !== undefined);
  }
  records = records.flat();
  console.log('records count: ', records.length)

  return records;
}

//requisição planilha Base LIFT
function requestAirtableData(url, offset) {
  
  const api_key = 'chave API AirTable'

  if(offset !== undefined){
    url = url + '?offset=' + offset
  }
  const headers = {
    'Authorization': 'Bearer ' + api_key,
    'Content-Type': 'application/json'
  }
  const options = {
    headers: headers,
    method: 'GET'
  }

  const response = UrlFetchApp.fetch(url, options).getContentText();
  const result = JSON.parse(response);
  //console.log('result: ', result.records)

  return result;
}


