# 📋 DECISIONS.md - Decisiones de Diseño

## ¿Por qué el problema C?

Elegí el **Problema C (Categorización de tickets)** como el problema a resolver porque:

1. **Impacto inmediato**: Reduce carga manual del equipo de Customer Success.
2. **Escalabilidad**: Un agente L0 puede manejar miles de tickets automáticamente.
3. **IA nativa**: Clasificación de texto es ideal para LLMs.
4. **ROI claro**: Tiempo ahorrado × volumen = beneficio medible.

## Enfoque: CLI Script Local

Decidí implementar como un script CLI Node.js en lugar de un servicio web por:

- **Enfoque en valor de IA**: No se gasta tiempo en infraestructura.
- **Data flow limpio**: Input JSON → Output JSON, nada más.
- **Sin deployment overhead**: El usuario configura su API key y corre.
- **MVP rápido**: Iteración directa en el código.

### Limitaciones

- **In-memory data**: Solo procesa `tickets.json` en memoria.
- **No DB real**: No hay persistencia real.
- **No integración con Zendesk**: Solo demo local.
- **Rate limits**: Depende de Groq.

## Stack Técnico

- **Runtime**: Node.js + TypeScript
- **LLM**: Groq (llama-3.1-8b-instant)
- **SDK**: OpenAI SDK (compatibilidad Groq)
- **JSON output forzado**: `response_format: { type: "json_object" }`
