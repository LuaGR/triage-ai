import { Ticket, ClassificationResult } from '../models';
import { printTopBorder, printDivider, printBottomBorder, getContentWidth } from './box';
import { printBoxLine } from './text';
import { APP_TITLE } from '../config';

export function printHeader() {
  console.log('');
  console.log(`╔${'═'.repeat(getContentWidth() + 2)}╗`);
  const leftPad = Math.floor((getContentWidth() + 2 - APP_TITLE.length) / 2);
  const rightPad = getContentWidth() + 2 - APP_TITLE.length - leftPad;
  console.log(`║${' '.repeat(leftPad)}${APP_TITLE}${' '.repeat(rightPad)}║`);
  console.log(`╚${'═'.repeat(getContentWidth() + 2)}╝`);
  console.log('');
}

export function printTicket(ticket: Ticket) {
  printTopBorder();
  printBoxLine(`📝 Ticket: ${ticket.id}`);
  printBoxLine(`   Mensaje: ${ticket.mensaje}`);
  printBoxLine(`   Origen:  ${ticket.origen}`);
  printDivider();
}

export function printAiResult(classification: ClassificationResult) {
  printBoxLine('✅ Clasificación:');
  printBoxLine(`   Categoría: ${classification.categoria}`);
  printBoxLine(`   Confianza: ${(classification.confianza * 100).toFixed(0)}%`);
  printBoxLine(`   Razón:     ${classification.razonamiento}`);
  printBottomBorder();
  console.log('');
}

export function printHumanResult(classification: ClassificationResult) {
  printBoxLine('👤 Clasificación MANUAL:');
  printBoxLine(`   Categoría: ${classification.categoria}`);
  printBoxLine(`   Confianza: 100%`);
  printBoxLine(`   Razón:     ${classification.razonamiento}`);
  printBottomBorder();
  console.log('');
}

export function printErrorResult(error: string) {
  printBoxLine(`❌ Error: ${error}`);
  printBottomBorder();
  console.log('');
}