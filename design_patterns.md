# Patrones de Diseño Estético - ClubNutricional

Este documento establece las directrices de diseño visual, estilos, variables y mejores prácticas para lograr una interfaz moderna, elegante y coherente, basada en transparencias (glassmorphism), degradados fluidos, sombras suaves y micro-animaciones premium utilizando GSAP.

---

## 1. Paleta de Colores y Degradados

Para lograr un aspecto premium inspirado en interfaces modernas, utilizaremos una paleta basada en gradientes vibrantes y colores cálidos que complementan el naranja de la marca.

### Fondo Principal (Mesh Gradient)
Un gradiente de malla CSS fluido que simula una iluminación dinámica de fondo, reduciendo tiempos de carga de imágenes pesadas:
```css
background: radial-gradient(at 0% 0%, rgba(249, 115, 22, 0.15) 0px, transparent 50%),
            radial-gradient(at 50% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(236, 72, 153, 0.12) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(249, 115, 22, 0.08) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(99, 102, 241, 0.1) 0px, transparent 50%),
            #f8fafc; /* Color de fondo base muy suave */
```

### Elementos Activos (Gradiente Principal)
Los botones, estados activos e indicadores clave utilizarán un gradiente fluido:
* **Fórmula:** `linear-gradient(135deg, #f97316 0%, #ea580c 100%)` (Naranja a Coral oscuro)
* **Texto sobre gradiente:** Blanco puro (`#ffffff`) para asegurar óptimo contraste y legibilidad.

---

## 2. Efecto Glassmorphism (Efecto de Cristal)

Los contenedores flotantes principales, como el Sidebar, el Header y las tarjetas de control del Dashboard, deben simular un cristal esmerilado que deja ver el fondo con degradados de forma difuminada.

### Especificaciones CSS
```css
background: rgba(255, 255, 255, 0.45) !important;
backdrop-filter: blur(16px) saturate(120%) !important;
-webkit-backdrop-filter: blur(16px) saturate(120%) !important;
border: 1px solid rgba(255, 255, 255, 0.3) !important;
box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.04) !important;
```

* **Nota:** Para mejorar el contraste y cumplir con normativas de accesibilidad en elementos de texto, se puede subir la opacidad del fondo a `rgba(255, 255, 255, 0.65)` o usar un fondo blanco puro (`#ffffff`) en tarjetas internas.

---

## 3. Bordes y Esquinas

Para lograr una apariencia orgánica y amigable, usaremos esquinas muy redondeadas:
* **Layouts principales / Tarjetas grandes:** `border-radius: 20px` (Equivalente a `rounded-2xl` o `rounded="xl"` en Vuetify).
* **Botones e Items de Navegación:** `border-radius: 12px` (Equivalente a `rounded-xl` o `rounded="lg"` en Vuetify).
* **Campos de Entrada / Inputs:** `border-radius: 10px` (Equivalente a `rounded-lg` o `rounded="md"` en Vuetify).

---

## 4. Sombras (Elevaciones)

Evitaremos sombras negras toscas. En su lugar, utilizaremos sombras coloreadas sutiles que asumen la tonalidad de su entorno o de su gradiente correspondiente:

* **Sombra Glass Estándar:** `0 8px 32px 0 rgba(31, 38, 135, 0.04)`
* **Sombra de Elemento Activo Naranja:** `0 4px 15px rgba(249, 115, 22, 0.25)`
* **Sombra de Tarjeta Elevada:** `0 10px 25px -5px rgba(0, 0, 0, 0.03), 0 8px 10px -6px rgba(0, 0, 0, 0.03)`

---

## 5. Micro-interacciones y Animaciones con GSAP

Para dar dinamismo a la interfaz, usaremos GSAP para animaciones y transiciones:

### Animación de Entrada de Tarjetas (Stagger)
Al cargar o cambiar de vista, los elementos de contenido deben aparecer secuencialmente:
```javascript
import gsap from 'gsap';

gsap.from('.dashboard-card', {
  opacity: 0,
  y: 20,
  duration: 0.6,
  stagger: 0.1,
  ease: 'power2.out'
});
```

### Transición del Menú Activo
Cuando un elemento de navegación se vuelve activo, la transición debe sentirse suave y fluida:
* Usar propiedades CSS de transición (`transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`).
* O bien animar el indicador activo con GSAP para un efecto dinámico de deslizamiento.
