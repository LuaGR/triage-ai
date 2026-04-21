export interface Ticket {
  id: string;
  mensaje: string;
  origen: 'WhatsApp' | 'Email';
}
