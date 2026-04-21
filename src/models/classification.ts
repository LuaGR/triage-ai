export type Category = 'envios' | 'pagos' | 'catalogo' | 'otros';

export interface ClassificationResult {
  categoria: Category | 'requiere_humano';
  confianza: number;
  razonamiento: string;
}