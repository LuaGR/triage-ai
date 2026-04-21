import { ClassificationResult } from '../models';
import { getContentWidth } from './box';

export interface ProcessedTicket extends ClassificationResult {
  id: string;
  resolved_by: 'AI' | 'Human';
}

export function printAiOpsReport(
  results: ProcessedTicket[],
  totalTime: number,
  totalPromptTokens: number,
  totalCompletionTokens: number,
  promptPricePer1K: number,
  completionPricePer1K: number
): void {
  const aiResolved = results.filter((r) => r.resolved_by === 'AI').length;
  const humanResolved = results.filter((r) => r.resolved_by === 'Human').length;
  const estimatedCost = ((totalPromptTokens * promptPricePer1K) + (totalCompletionTokens * completionPricePer1K)) / 1000;

  console.log('═'.repeat(getContentWidth() + 4));
  console.log('                    📊 Reporte de Operaciones AI:                     ');
  console.log('═'.repeat(getContentWidth() + 4));
  console.log('');
  console.log(`   - Tickets Procesados: ${results.length}`);
  console.log(`   - Resueltos por IA: ${aiResolved}`);
  console.log(`   - Escalados a Humano: ${humanResolved}`);
  console.log(`   - Tiempo total de ejecución: ${totalTime} segundos`);
  console.log(`   - Tokens Consumidos: ${totalPromptTokens.toLocaleString()} (Prompt) / ${totalCompletionTokens.toLocaleString()} (Completion)`);
  console.log(`   - Costo Estimado: $${estimatedCost.toFixed(4)} USD`);
  console.log('');
  console.log('═'.repeat(getContentWidth() + 4));
  console.log('');
}