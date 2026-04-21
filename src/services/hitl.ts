import * as readline from 'readline';
import { ClassificationResult, Category } from '../models';
import { HITL_THRESHOLD } from '../config';

const CATEGORIES: readonly Category[] = ['envios', 'pagos', 'catalogo', 'spam'];

export function needsHumanIntervention(classification: { categoria: Category | 'requiere_humano'; confianza: number }): boolean {
  return classification.categoria === 'spam' || 
         classification.categoria === 'requiere_humano' || 
         classification.confianza < HITL_THRESHOLD;
}

export async function askUser(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

export async function requestHumanIntervention(
  ticketId: string,
  confianza: number,
  razonamiento: string,
  mensaje: string
): Promise<ClassificationResult> {
  console.log('');
  console.log('┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ ⚠️  ALERTA: La IA no pudo clasificar el ticket ' + ticketId.padEnd(23) + '│');
  console.log('│    Confianza: ' + (confianza * 100).toFixed(0) + '%'.padEnd(53) + '│');
  console.log('├──────────────────────────────────────────────────────────────────┤');
  console.log('│    Razón: ' + razonamiento.substring(0, 50).padEnd(53) + '│');
  console.log('│    ' + razonamiento.substring(50).padEnd(53) + '│');
  console.log('├──────────────────────────────────────────────────────────────────┤');
  console.log('│    Mensaje: ' + mensaje.substring(0, 50).padEnd(51) + '│');
  console.log('│    ' + mensaje.substring(50).padEnd(53) + '│');
  console.log('└──────────────────────────────────────────────────────────────────┘');
  console.log('');
  console.log('   Intervención Humana Requerida. Seleccione la categoría real:');

  CATEGORIES.forEach((cat, i) => {
    console.log(`   [${i + 1}] ${cat}`);
  });
  console.log('');

  let valid = false;
  let selection = '';

  while (!valid) {
    selection = await askUser('   > ');
    const num = parseInt(selection, 10);
    if (num >= 1 && num <= 4) {
      valid = true;
    } else {
      console.log('   ❌ Selección inválida. Intenta de nuevo.');
    }
  }

  const category = CATEGORIES[parseInt(selection, 10) - 1];

  return {
    categoria: category,
    confianza: 1.0,
    razonamiento: `Clasificación manual por operador. Categoría: ${category}`,
  };
}