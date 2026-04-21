import 'dotenv/config';
import tickets from './data/tickets.json';
import { Ticket, ClassificationResult, Category } from './src/models';
import { classifyTicket, ClassificationResponse, requestHumanIntervention } from './src/services';
import { printTopBorder, printDivider, printBottomBorder, printBoxLine, printSummaryTable, printAiOpsReport, getContentWidth, ProcessedTicket } from './src/ui';

const HITL_THRESHOLD = 0.5;
const GROQ_PROMPT_PRICE_PER_1K = 0.05;
const GROQ_COMPLETION_PRICE_PER_1K = 0.08;

function needsHumanIntervention(classification: ClassificationResponse): boolean {
  return classification.categoria === 'spam' || 
         classification.categoria === 'requiere_humano' || 
         classification.confianza < HITL_THRESHOLD;
}

async function main() {
  console.log('');
  console.log(`╔${'═'.repeat(getContentWidth() + 2)}╗`);
  const title = 'TRIAGE AI - CLASIFICADOR DE TICKETS';
  const leftPad = Math.floor((getContentWidth() + 2 - title.length) / 2);
  const rightPad = getContentWidth() + 2 - title.length - leftPad;
  console.log(`║${' '.repeat(leftPad)}${title}${' '.repeat(rightPad)}║`);
  console.log(`╚${'═'.repeat(getContentWidth() + 2)}╝`);
  console.log('');

  const results: ProcessedTicket[] = [];
  const startTime = performance.now();
  let totalPromptTokens = 0;
  let totalCompletionTokens = 0;

  for (const ticket of tickets as Ticket[]) {
    printTopBorder();
    printBoxLine(`📝 Ticket: ${ticket.id}`);
    printBoxLine(`   Mensaje: ${ticket.mensaje}`);
    printBoxLine(`   Origen:  ${ticket.origen}`);
    printDivider();

    try {
      const classification: ClassificationResponse = await classifyTicket(ticket.mensaje);

      totalPromptTokens += classification.promptTokens;
      totalCompletionTokens += classification.completionTokens;

      if (needsHumanIntervention(classification)) {
        const manualClassification = await requestHumanIntervention(
          ticket.id, 
          classification.confianza, 
          classification.razonamiento, 
          ticket.mensaje
        );
        results.push({ id: ticket.id, ...manualClassification, resolved_by: 'Human' });

        printBoxLine('👤 Clasificación MANUAL:');
        printBoxLine(`   Categoría: ${manualClassification.categoria}`);
        printBoxLine(`   Confianza: 100%`);
        printBoxLine(`   Razón:     ${manualClassification.razonamiento}`);
      } else {
        const { promptTokens, completionTokens, ...classificationData } = classification;
        results.push({ id: ticket.id, ...classificationData, resolved_by: 'AI' });

        printBoxLine('✅ Clasificación:');
        printBoxLine(`   Categoría: ${classification.categoria}`);
        printBoxLine(`   Confianza: ${(classification.confianza * 100).toFixed(0)}%`);
        printBoxLine(`   Razón:     ${classification.razonamiento}`);
      }
    } catch (error) {
      printBoxLine(`❌ Error: ${String(error)}`);
      results.push({
        id: ticket.id,
        categoria: 'spam',
        confianza: 0,
        razonamiento: `Error en clasificación: ${String(error)}`,
        resolved_by: 'Human',
      });
    }

    printBottomBorder();
    console.log('');
  }

  const totalTime = ((performance.now() - startTime) / 1000);

  printSummaryTable(results);
  printAiOpsReport(results, totalTime, totalPromptTokens, totalCompletionTokens, GROQ_PROMPT_PRICE_PER_1K, GROQ_COMPLETION_PRICE_PER_1K);
}

main().catch(console.error);