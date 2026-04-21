# 🛠️ PROCESS.md - Bitácora de Construcción

## 1. Uso de IA Durante el Desarrollo

### Prompts que Funcionaron

#### Prompt Final - ✅ Exitoso

```text
Eres un clasificador de tickets para 'PuebloLindo'. Clasifica el mensaje en UNA de estas categorías:

- "envios": Consulta sobre estado de pedido, entrega, shipping o ubicación.
- "pagos": Menciona cobros, tarjetas, reembolsos, facturación o precios.
- "catalogo": Pregunta sobre productos, fotos, uso de la plataforma.
- "requiere_humano": No clasificable en las anteriores, agresivo, insultos, o cualquier duda.

REGLAS:
1. JSON válido con: "categoria", "confianza", "razonamiento".
2. Cualquier duda o mensaje problemático → requiere_humano.
3. Confianza: 0.0 a 1.0.
4. Razonamiento: máximo 2 líneas.
```

### Prompts que Fallaron

#### Iteration 1 - ❌ Inconsistente

```text
Clasifica este mensaje en: envios, pagos, catalogo, o requiere_humano
```

**Problema**: Devolvía texto libre, inconsistente.  
**Solución**: Agregar `response_format: { type: "json_object" }`

---

## 2. Cambios de Enfoque

### Cambio 1: Clasificación de Mensajes en Inglés

**Antes**: Se quería que mensajes en otros idiomas se escalaran directamente a humano.  
**Después**: El modelo `llama-3.1-8b-instant` puede clasificar mensajes en inglés usando sus capacidades multilingües. El mensaje "I need help with my order, it arrived broken" se clasifica como "envios" porque el modelo entiende el contenido.

**Por qué**: Simplifica el flujo. El modelo maneja multilingual directamente.

### Cambio 2: CLI en Lugar de Interfaz Web

**Antes**: Se consideró una interfaz web (Next.js) o API REST para ejecutar el clasificador.  
**Después**: Script CLI que procesa un archivo JSON estático directamente en terminal.

**Por qué**: 
- Enfoque en valor de IA, no en infraestructura
- Sin deployment overhead
- MVP rápido y ejecutable inmediatamente

### Cambio 3: Human-in-the-Loop (HITL)

**Problema**: Algunos tickets necesitan intervención humana (baja confianza o casos ambiguos).  
**Solución**: Implementar pausa interactiva que muestra ticket, confianza, razón y permite selección manual.

```
⚠️  ALERTA: La IA no pudo clasificar el ticket T005
   Confianza: 0%
   Razón: El cliente utiliza lenguaje agresivo...
   Mensaje: "¡SON UNOS ESTAFADORES..."

Intervención Humana Requerida. Seleccione la categoría real:
[1] envios  [2] pagos  [3] catalogo  [4] spam
> _
```

### Cambio 4: AI Ops Metrics

**Problema**: No había forma de saber el rendimiento del sistema.  
**Solución**: Reporte final con métricas de ejecución.

```
📊 Reporte de Operaciones AI:
   - Tickets Procesados: 5
   - Resueltos por IA: 4
   - Escalados a Humano: 1
   - Tiempo total de ejecución: 3.3 segundos
   - Tokens Consumidos: 750 (Prompt) / 150 (Completion)
   - Costo Estimado: $0.0495 USD
```

---

## 3. Prevención de Hallucinations

### Mecanismos Implementados

| Mecanismo | Propósito |
|-----------|-----------|
| `temperature: 0.0` | Sin creatividad |
| `response_format: { type: "json_object" }` | Fuerza JSON válido |
| Categoría fallback | Cualquier duda → `requiere_humano` |

### Por qué el Sistema No Inventa Información

1. **Solo clasifica**: No busca, no consulta APIs externas
2. **Sin acceso a datos**: Solo recibe el mensaje del ticket
3. **JSON forzado**: El modelo solo puede devolver categorías predefinidas
4. **Confianza**: Si no está seguro, el modelo debe devolver `requiere_humano`

### Cómo Verifiqué que No Inventa Información

**Método de verificación**: Revisé manualmente cada clasificación para confirmar que el razonamiento coincide con el contenido real del mensaje.

| Verificación | Resultado |
|-------------|-----------|
| T001: "pedido", "días" → envios | ✅ Coincide |
| T002: "cobrar", "tarjeta" → pagos | ✅ Coincide |
| T003: "fotos", "app" → catalogo | ✅ Coincide |
| T004: "order", "broken" → envios | ✅ Coincide |
| T005: "estafadores", "gerente" → AI: requiere_humano → HITL → Humano: otros | ✅ Coincide |

**Qué busqué**:
- ¿El razonamiento menciona keywords que existen en el mensaje original?
- ¿La categoría es lógica dado el contenido?
- ¿Hay algo en el razonamiento que no esté en el mensaje?

**Resultado**: En todos los casos, el razonamiento solo usa información presente en el mensaje de entrada. No hay facts inventados.

### Verificación: Casos de Prueba

| ID | Mensaje | Clasificación AI | Resultado Final | Flujo |
|----|---------|------------------|-----------------|-------|
| T001 | ¿Dónde está mi pedido? | envios | envios | Resuelto por IA |
| T002 | Me cobraron dos veces | pagos | pagos | Resuelto por IA |
| T003 | La app no me deja subir fotos | catalogo | catalogo | Resuelto por IA |
| T004 | I need help with my order... | envios | envios | Resuelto por IA (multilingüe) |
| T005 | ¡SON UNOS ESTAFADORES! | requiere_humano | otros | AI: requiere_humano → HITL → Humano: otros |

---

## 4. Escalabilidad 10x

### Situación Actual

- 5 tickets de prueba en memoria
- CLI que procesa archivo JSON estático
- Sin persistencia, sin base de datos

### Propuesta para 10x Volumen

| Problema | Solución |
|----------|----------|
| Procesamiento secuencial lento | Batch processing: agrupar hasta 50 mensajes en una sola llamada (Groq soporta múltiples messages) |
| Sin persistencia | DynamoDB para almacenar clasificaciones y métricas |
| Sin API | Exponer como AWS Lambda + API Gateway |
| Monitoreo | CloudWatch para métricas de clasificación |
| Rate limits | Implementar cola (SQS) si se excede límite |

### Cambios de IA para Escala

- **Fine-tuning**: Entrenar modelo con datos históricos de PuebloLindo
- **Routing por confianza**: Si confianza > 0.8 → automatizar; si < 0.5 → escalar
- **Detección de urgencia**: Clasificar tickets urgentes para priorización

---

## 5. Mejoras con una Semana Extra


- [ ] Fine-tuning con datos históricos de tickets de PuebloLindo
- [ ] Detección de sentiment (urgente vs normal)
- [ ] Auto-etiquetado de temas específicos dentro de cada categoría
- [ ] Mejorar prompt con few-shot examples para casos edge

---

## 6. Lecciones Aprendidas

1. **Structured Outputs es esencial**: `response_format: { type: "json_object" }` previene la mayoría de hallucinations.
2. **Categoría fallback**: Siempre tener `requiere_humano` como opción para casos ambiguos.
3. **Modelos multilingües**: No asumir que el modelo solo entiende español.
4. **CLI vs Interfaz**: Para un MVP, CLI es más rápido y directo que una interfaz web.
5. **Verificar modelos deprecated**: Groq decomisa frecuentemente.
