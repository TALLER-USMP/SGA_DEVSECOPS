# 🛠️ Guía de contribución

Este documento resume las convenciones que debe seguir el equipo al contribuir dentro de la prueba de concepto.

---

## 📌 Convención de commits

Usamos **Conventional Commits**, lo que significa que cada mensaje de commit debe empezar con un tipo que indique qué tipo de cambio se hace.

| Tipo       | Uso cuando…                                                      |
|------------|------------------------------------------------------------------|
| `feat`     | agregas una nueva funcionalidad                                  |
| `fix`      | corriges un bug                                                  |
| `style`    | solo hay cambios de formato (indentación, nombres, etc.)         |
| `refactor` | refactorizas código sin agregar una nueva funcionalidad          |
| `docs`     | modificas o agregas documentación                                |
| `test`     | agregas o modificas pruebas                                      |
| `chore`    | tareas de apoyo (scripts, configuraciones, pipelines, etc.)      |

🔎 **Ejemplos válidos**
**Formato sugerido:**  
`{tipo} {DIA.MES.CORRELATIVO} : {descripción}`

feat 12.08.00001 : Se agregó endpoint de métricas en usuarios
feat 13.08.00002 : Se modificó el endpoint de métricas en usuarios para manejos individuales
style 14.08.00003 : Se estandarizaron los estilos de los card

