import 'dotenv/config';
import tickets from './data/tickets.json';
import { Ticket } from './src/models';
import { classifyTicket, ClassificationResponse, requestHumanIntervention, needsHumanIntervention } from './src/services';
import { printSummaryTable, printAiOpsReport, printHeader, printTicket, printAiResult, printHumanResult, printErrorResult, ProcessedTicket } from './src/ui';
import { GROQ_PROMPT_PRICE_PER_1K, GROQ_COMPLETION_PRICE_PER_1K } from './src/config';

async function main() {
  printHeader();

  const results: ProcessedTicket[] = [];
  const startTime = performance.now();
  let totalPromptTokens = 0;
  let totalCompletionTokens = 0;

  for (const ticket of tickets as Ticket[]) {
    printTicket(ticket);

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
        printHumanResult(manualClassification);
      } else {
        const { promptTokens, completionTokens, ...classificationData } = classification;
        results.push({ id: ticket.id, ...classificationData, resolved_by: 'AI' });
        printAiResult(classification);
      }
    } catch (error) {
      results.push({
        id: ticket.id,
        categoria: 'otros',
        confianza: 0,
        razonamiento: `Error en clasificación: ${String(error)}`,
        resolved_by: 'Human',
      });
      printErrorResult(String(error));
    }
  }

  const totalTime = ((performance.now() - startTime) / 1000);

  printSummaryTable(results);
  printAiOpsReport(results, totalTime, totalPromptTokens, totalCompletionTokens, GROQ_PROMPT_PRICE_PER_1K, GROQ_COMPLETION_PRICE_PER_1K);
}

main().catch(console.error);
