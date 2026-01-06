function atualizarClassificacao() {
  const sheet = SpreadsheetApp
    .getActive()
    .getSheetByName("Bolao");

  const primeiroGrupoLinha = 3;
  const step = 6;
  const qtdGrupos = 12;

  for (let i = 0; i < qtdGrupos; i++) {
    const startRow = primeiroGrupoLinha + i * step;
    const endRow = startRow + 3;
    const rangeA1 = `H${startRow}:L${endRow}`;
    sheet.getRange(rangeA1).sort([
      { column: 9, ascending: false },   // Pontos
      { column: 10, ascending: false },   // Saldo de gols
      { column: 11, ascending: false }   // Gols marcados
    ]);
  }
  escreveTerceiros();
}

function getMelhoresTerceiros() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName("Bolao");
  const startRow = 5;
  const step = 6;
  const qtdGrupos = 12;
  const letras = "ABCDEFGHIJKL".split("");

  const thirds = [];
  for (let i = 0; i < qtdGrupos; i++) {
    const row = startRow + i * step;
    const vals = sheet.getRange(row,8,1,4).getValues()[0];
    const name = (vals[0] || "").toString();
    const pts = Number(vals[1]) || 0;
    const gd = Number(vals[2]) || 0;
    const gf = Number(vals[3]) || 0;
    thirds.push({
      group: letras[i],
      name: name,
      pts: pts,
      gd: gd,
      gf: gf,
      row: row
    });
  }

  thirds.sort((a,b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd  !== a.gd)  return b.gd - a.gd;
    if (b.gf  !== a.gf)  return b.gf - a.gf;
    return a.group.localeCompare(b.group);
  });

  return {thirds: thirds};
}

function escreveTerceiros(){
  const topThirds = getMelhoresTerceiros();
  const allThirds = topThirds.thirds; 
  const nameMap = {};
  allThirds.forEach(o => { nameMap[o.group] = o.name;});

  const top8 = allThirds.slice(0,8).map(o => o.group);

  const allGroups = "ABCDEFGHIJKL".split("");
  const chaveArray = allGroups.map(g => top8.indexOf(g) !== -1 ? g : "");
  const chave = chaveArray.join("");

  const ss = SpreadsheetApp.getActive();
  const ssTabela = ss.getSheetByName("tabelaTerceiros");

  const N = 495;              
  const startRow = 1;         
  const keyStartCol = 2;       
  const keyNumCols = 12;       
  const valStartCol = 15;    
  const valNumCols = 8;      

  const maxCols = valStartCol + valNumCols - 1;
  const data = ssTabela.getRange(startRow, 1, N, maxCols).getValues();

  const dict = {}; 

  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    const key = row
      .slice(keyStartCol - 1, keyStartCol - 1 + keyNumCols)
      .map(x => String(x || "").trim())
      .join("");

    const value = row
      .slice(valStartCol - 1, valStartCol - 1 + valNumCols)
      .map(x => String(x || "").trim())
      .join("")          
      .replace(/[0-9]/g, "");

    if (key && !(key in dict)) dict[key] = value;
  }

  const mappingString = dict[chave];
  const targetCells = ['F85','F91','F88','F81','F87','F84','F94','F86'];
  const bolaoSheet = ss.getSheetByName("Bolao");

  const mapping = String(mappingString).trim().toUpperCase();
  for (let i = 0; i < 8; i++) {
    const ch = mapping.charAt(i) || "";
    const teamName = ch ? (nameMap[ch] || "") : "";
    const cellA1 = targetCells[i];
    try {
      bolaoSheet.getRange(cellA1).setValue(teamName);
    } catch (e) {
      Logger.log("Erro ao escrever em " + cellA1 + ": " + e);
    }
  }

  Logger.log("Escrita concluída para chave: " + chave + " -> " + mappingString);
  return { status: "ok", key: chave, mapping: mappingString };
}

function onEditHandler(e) {
  atualizarClassificacao();
}


function doGet(e) {
  return ContentService
    .createTextOutput("Web App ativo")
    .setMimeType(ContentService.MimeType.TEXT);
}


