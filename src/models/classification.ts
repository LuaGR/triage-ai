export type Category = 'envios' | 'pagos' | 'catalogo' | 'spam' | 'requiere_humano';

export interface ClassificationResult {
  categoria: Category;
  confianza: number;
  razonamiento: string;
}