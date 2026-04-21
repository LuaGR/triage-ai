import { getContentWidth } from './box';
import { ProcessedTicket } from './reporter';

export function chunkText(text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let remaining = text;
  
  while (remaining.length > maxWidth) {
    let breakIdx = remaining.lastIndexOf(' ', maxWidth);
    if (breakIdx === -1) breakIdx = maxWidth;
    
    lines.push(remaining.substring(0, breakIdx));
    remaining = remaining.substring(breakIdx).trimStart();
  }
  
  if (remaining.length > 0) lines.push(remaining);
  return lines;
}

export function printSummaryTable(results: ProcessedTicket[]) {
  const CONTENT_WIDTH = getContentWidth();
  const W_ID = 4;
  const W_CAT = 16;
  const W_CONF = 9;
  const W_RAZ = 28;

  console.log('═'.repeat(CONTENT_WIDTH + 4));
  console.log('  📊 RESUMEN FINAL  ');
  console.log('═'.repeat(CONTENT_WIDTH + 4));
  console.log('');
  
  console.log(` ${'ID'.padEnd(W_ID)} │ ${'CATEGORÍA'.padEnd(W_CAT)} │ ${'CONFIANZA'.padEnd(W_CONF)} │ ${'RAZÓN'.padEnd(W_RAZ)} `);
  
  const rowDivider = `${'─'.repeat(W_ID + 2)}┼${'─'.repeat(W_CAT + 2)}┼${'─'.repeat(W_CONF + 2)}┼${'─'.repeat(W_RAZ + 2)}`;
  console.log(rowDivider);
  
  for (let rIdx = 0; rIdx < results.length; rIdx++) {
    const r = results[rIdx];
    const confStr = `${(r.confianza * 100).toFixed(0)}%`;
    const razLines = chunkText(r.razonamiento, W_RAZ);
    
    for (let i = 0; i < razLines.length; i++) {
      const colId = i === 0 ? r.id.padEnd(W_ID) : ' '.repeat(W_ID);
      const colCat = i === 0 ? r.categoria.padEnd(W_CAT) : ' '.repeat(W_CAT);
      const colConf = i === 0 ? confStr.padStart(W_CONF) : ' '.repeat(W_CONF);
      const colRaz = razLines[i].padEnd(W_RAZ);
      
      console.log(` ${colId} │ ${colCat} │ ${colConf} │ ${colRaz} `);
    }

    if (rIdx < results.length - 1) {
      console.log(rowDivider);
    }
  }
  console.log('─'.repeat(CONTENT_WIDTH + 4));
  console.log('');
}