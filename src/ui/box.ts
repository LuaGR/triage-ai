const CONTENT_WIDTH = 64;

export function printTopBorder() {
  console.log(`╭${'─'.repeat(CONTENT_WIDTH + 2)}╮`);
}

export function printDivider() {
  console.log(`├${'─'.repeat(CONTENT_WIDTH + 2)}┤`);
}

export function printBottomBorder() {
  console.log(`╰${'─'.repeat(CONTENT_WIDTH + 2)}╯`);
}

export function getContentWidth(): number {
  return CONTENT_WIDTH;
}