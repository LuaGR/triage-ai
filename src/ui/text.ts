import { getContentWidth } from './box';

function padLineCompensated(text: string, targetWidth: number): string {
  const visualExtraWidth = (text.match(/[✅❌]/g) || []).length;
  const spacesNeeded = targetWidth - text.length - visualExtraWidth;
  return text + ' '.repeat(Math.max(0, spacesNeeded));
}

export function printBoxLine(content: string) {
  const CONTENT_WIDTH = getContentWidth();
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