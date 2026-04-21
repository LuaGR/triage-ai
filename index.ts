import 'dotenv/config';
import OpenAI from 'openai';
import tickets from './tickets.json';

interface Ticket {
  id: string;
  mensaje: string;
  origen: 'WhatsApp' | 'Email';
}

interface ClassificationResult {
  categoria: 'envios' | 'pagos' | 'catalogo' | 'requiere_humano';
  confianza: number;
  razonamiento: string;
}

const groq = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `Eres un clasificador de tickets para 'PuebloLindo'. Clasifica el mensaje en UNA de estas categorías:

- "envios": Consulta sobre estado de pedido, entrega, shipping o ubicación.
- "pagos": Menciona cobros, tarjetas, reembolsos, facturación o precios.
- "catalogo": Pregunta sobre productos, fotos, uso de la plataforma.
- "requiere_humano": Agresivo, insultos, exige gerente, o no clasificable.

REGLAS:
1. JSON válido con: "categoria", "confianza", "razonamiento".
2. Cualquier duda → requiere_humano.
3. Confianza: 0.0 a 1.0.
4. Razonamiento: máximo 2 líneas.`;

async function classifyTicket(message: string): Promise<ClassificationResult> {
  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: message },
    ],
    temperature: 0.0,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from model');
  }

  return JSON.parse(content) as ClassificationResult;
}

// ==========================================
// UTILERÍAS DE FORMATO Y CONSOLA (UI)
// ==========================================

const CONTENT_WIDTH = 64; // Ancho interno del texto

function printTopBorder() {
  console.log(`╭${'─'.repeat(CONTENT_WIDTH + 2)}╮`);
}

function printDivider() {
  console.log(`├${'─'.repeat(CONTENT_WIDTH + 2)}┤`);
}

function printBottomBorder() {
  console.log(`╰${'─'.repeat(CONTENT_WIDTH + 2)}╯`);
}

/**
 * Calcula el padding correcto compensando emojis que JS cuenta como length = 1
 * pero que la terminal renderiza usando 2 espacios.
 */
function padLineCompensated(text: string, targetWidth: number): string {
  // Ajuste manual: ✅ y ❌ tienen length 1 pero ocupan 2 espacios visuales en consola.
  const visualExtraWidth = (text.match(/[✅❌]/g) || []).length;
  const spacesNeeded = targetWidth - text.length - visualExtraWidth;
  return text + ' '.repeat(Math.max(0, spacesNeeded));
}

function printBoxLine(content: string) {
  let remaining = content;
  
  while (remaining.length > CONTENT_WIDTH) {
    let breakIdx = remaining.lastIndexOf(' ', CONTENT_WIDTH);
    if (breakIdx === -1) breakIdx = CONTENT_WIDTH;
    
    const line = remaining.substring(0, breakIdx);
    console.log(`│ ${padLineCompensated(line, CONTENT_WIDTH)} │`);
    
    remaining = remaining.substring(breakIdx).trimStart();
  }
  
  if (remaining.length > 0) {
    console.log(`│ ${padLineCompensated(remaining, CONTENT_WIDTH)} │`);
  }
}

function chunkText(text: string, maxWidth: number): string[] {
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

// ==========================================
// FLUJO PRINCIPAL
// ==========================================

async function main() {
  console.log('');
  console.log(`╔${'═'.repeat(CONTENT_WIDTH + 2)}╗`);
  const title = 'TRIAGE AI - CLASIFICADOR DE TICKETS';
  const leftPad = Math.floor((CONTENT_WIDTH + 2 - title.length) / 2);
  const rightPad = CONTENT_WIDTH + 2 - title.length - leftPad;
  console.log(`║${' '.repeat(leftPad)}${title}${' '.repeat(rightPad)}║`);
  console.log(`╚${'═'.repeat(CONTENT_WIDTH + 2)}╝`);
  console.log('');

  const results: Array<Ticket & ClassificationResult> = [];

  for (const ticket of tickets as Ticket[]) {
    printTopBorder();
    printBoxLine(`📝 Ticket: ${ticket.id}`);
    printBoxLine(`   Mensaje: ${ticket.mensaje}`);
    printBoxLine(`   Origen:  ${ticket.origen}`);
    printDivider();

    try {
      const classification = await classifyTicket(ticket.mensaje);
      results.push({ ...ticket, ...classification });

      printBoxLine('✅ Clasificación:');
      printBoxLine(`   Categoría: ${classification.categoria}`);
      printBoxLine(`   Confianza: ${(classification.confianza * 100).toFixed(0)}%`);
      printBoxLine(`   Razón:     ${classification.razonamiento}`);
    } catch (error) {
      printBoxLine(`❌ Error: ${String(error)}`);
    }
    
    printBottomBorder();
    console.log('');
  }

  // --- RENDERIZADO DE TABLA FINAL ---
  
  const W_ID = 4;
  const W_CAT = 16;
  const W_CONF = 9;
  const W_RAZ = 28;

  console.log('═'.repeat(CONTENT_WIDTH + 4));
  console.log('  📊 RESUMEN FINAL  ');
  console.log('═'.repeat(CONTENT_WIDTH + 4));
  console.log('');
  
  // Header
  console.log(` ${'ID'.padEnd(W_ID)} │ ${'CATEGORÍA'.padEnd(W_CAT)} │ ${'CONFIANZA'.padEnd(W_CONF)} │ ${'RAZÓN'.padEnd(W_RAZ)} `);
  
  // Variable para el divisor de filas
  const rowDivider = `${'─'.repeat(W_ID + 2)}┼${'─'.repeat(W_CAT + 2)}┼${'─'.repeat(W_CONF + 2)}┼${'─'.repeat(W_RAZ + 2)}`;
  console.log(rowDivider);
  
  // Filas
  for (let rIdx = 0; rIdx < results.length; rIdx++) {
    const r = results[rIdx];
    const idStr = r.id;
    const catStr = r.categoria;
    const confStr = `${(r.confianza * 100).toFixed(0)}%`;
    const razLines = chunkText(r.razonamiento, W_RAZ);
    
    for (let i = 0; i < razLines.length; i++) {
      const colId = i === 0 ? idStr.padEnd(W_ID) : ' '.repeat(W_ID);
      const colCat = i === 0 ? catStr.padEnd(W_CAT) : ' '.repeat(W_CAT);
      const colConf = i === 0 ? confStr.padStart(W_CONF) : ' '.repeat(W_CONF);
      const colRaz = razLines[i].padEnd(W_RAZ);
      
      console.log(` ${colId} │ ${colCat} │ ${colConf} │ ${colRaz} `);
    }

    // Dibujar divisor entre filas (excepto en la última fila)
    if (rIdx < results.length - 1) {
      console.log(rowDivider);
    }
  }
  console.log('─'.repeat(CONTENT_WIDTH + 4));
  console.log('');
}

main().catch(console.error);
