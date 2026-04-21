import * as readline from 'readline';
import { ClassificationResult, Category } from '../models';
import { HITL_THRESHOLD } from '../config';

const CATEGORIES: readonly Category[] = ['envios', 'pagos', 'catalogo', 'otros'];

export function needsHumanIntervention(classification: { categoria: Category | 'requiere_humano'; confianza: number }): boolean {
  return classification.categoria === 'requiere_humano' || 
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
  console.log('│ ⚠️  ALERTA: La IA solicita revisión manual.'.padEnd(63) + '│');
  console.log('│    Razón: ' + razonamiento.substring(0, 50).padEnd(53) + '│');
  if (razonamiento.length > 50) {
    console.log('│    ' + razonamiento.substring(50).padEnd(53) + '│');
  }
  console.log('├──────────────────────────────────────────────────────────────────┤');
  const msgLines = mensaje.length > 50 ? [mensaje.substring(0, 50), mensaje.substring(50)] : [mensaje];
  msgLines.forEach((line, i) => {
    console.log(`│    Mensaje: ${line.padEnd(51)}${i === 0 ? '│' : ''}`);
  });
  console.log('└──────────────────────────────────────────────────────────────────┘');
  console.log('');
  console.log('   Seleccione la categoría final:');

  CATEGORIES.forEach((cat, i) => {
    const label = cat === 'otros' ? 'otros (Consulta atípica legítima)' : cat;
    console.log(`   [${i + 1}] ${label}`);
  });
  console.log('');

  let valid = false;
  let selection = '';

  while (!valid) {
    selection = await askUser('   > ');
    const num = parseInt(selection, 10);
    if (num >= 1 && num <= CATEGORIES.length) {
      valid = true;
    } else {
      console.log(`   ❌ Selección inválida. Ingresa un número entre 1 y ${CATEGORIES.length}.`);
    }
  }

  const category = CATEGORIES[parseInt(selection, 10) - 1];

  return {
    categoria: category,
    confianza: 1.0,
    razonamiento: `Clasificación manual por operador. Categoría: ${category}`,
  };
}