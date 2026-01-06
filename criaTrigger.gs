function criarTriggerOnEdit() {
  ScriptApp.newTrigger("onEditHandler")
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit()
    .create();
}
