# Design System: Liquid Glass Darknight

## 1. Overview & Creative North Star
**Creative North Star: "The Neon Nocturne"**

This design system transcends standard mobile interfaces by treating the screen as a multi-dimensional, luminous void. We are not building "pages"; we are curating a digital atmosphere where complex Japanese Kanji characters float within a pressurized, futuristic environment. 

To break the "template" look, we utilize **Intentional Fluidity**. This means rejecting rigid, boxed grids in favor of organic "blob" silhouettes and asymmetrical depth. By overlapping translucent surfaces and letting neon accents bleed through layers of frosted glass, we create a signature aesthetic that feels premium, cinematic, and deeply intentional.

---

## 2. Colors & Surface Philosophy
The palette is rooted in the "Darknight" philosophy—using deep, midnight tones as a canvas for high-energy luminescence.

### The Palette (Material Design Tokens)
*   **Primary (Electric Purple):** `#d2bbff` (The energy source)
*   **Secondary (Cyan):** `#d3fbff` (The precision tool)
*   **Tertiary (Magenta/Violet):** `#ecb2ff` (The accent highlight)
*   **Surface (Midnight Blue):** `#0d1321` (The void)
*   **Container Tiers:** From `surface_container_lowest` (#080e1c) to `surface_container_highest` (#2f3444).

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid, opaque borders to define sections. Boundaries must be established through:
1.  **Tonal Shifts:** A `surface_container_low` card sitting on a `surface` background.
2.  **Luminous Separation:** Using a subtle glow or background blur to indicate a change in context.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of glass. 
*   **The Base:** Use `surface` or `surface_dim` for the background.
*   **The Mid-Ground:** Use `surface_container` for primary content areas.
*   **The Foreground:** Use `surface_container_highest` for interactive elements like cards or inputs. 
*   **The Glass Layer:** For floating modals or navigation bars, use a custom `BlurView` with 15% opacity white `outline_variant` borders to mimic the "Liquid Glass" effect.

---

## 3. Typography: The Modern Script
Typography must balance the technical complexity of Kanji with the sleekness of "Space Grotesk" and "Manrope."

*   **Display & Headlines (Space Grotesk):** These are our "editorial" moments. Use `display-lg` (3.5rem) with tight letter-spacing to create an authoritative, futuristic feel. This font’s geometric nature complements the neon accents.
*   **Body & Titles (Manrope):** Chosen for its high legibility in dark mode and its neutral, modern stance. It ensures that complex Kanji characters (rendered in `title-lg` or `body-lg`) remain crisp and readable against glowing backgrounds.
*   **Hierarchy as Identity:** Use a high-contrast scale. Pair a massive `display-md` Kanji character with a tiny, all-caps `label-sm` English translation to create an asymmetrical, high-fashion editorial layout.

---

## 4. Elevation & Depth
We abandon traditional drop shadows in favor of **Tonal Layering** and **Ambient Glows.**

*   **The Layering Principle:** Depth is achieved by "stacking" container tiers. An inner search bar should be `surface_container_lowest` (sunken) inside a `surface_container_high` (raised) glass card.
*   **Ambient Shadows:** If a floating effect is required (e.g., a FAB), use a shadow tinted with the `primary` (Electric Purple) color at 8% opacity. This mimics the light cast by a neon sign.
*   **The "Ghost Border" Fallback:** When separation is vital for accessibility, use the `outline_variant` at 15% opacity. This creates a "hairline" glass edge rather than a solid wall.
*   **Glassmorphism:** All overlays must use a `backdrop-filter: blur(20px)` combined with a subtle linear gradient (Top-Left: 15% white, Bottom-Right: 0% white) to simulate physical glass depth.

---

## 5. Components

### Buttons
*   **Primary:** A gradient transition from `primary` to `primary_container`. No borders. High-contrast `on_primary` text.
*   **Secondary (Glass):** A blurred background with the "Ghost Border."
*   **Interaction:** On press, the button should "pulse," increasing the intensity of its ambient purple glow.

### Cards & Lists
*   **The Divider Ban:** Never use lines to separate list items. Use vertical whitespace (1.5rem `xl` scale) or alternating subtle background tints between `surface_container_low` and `surface_container_lowest`.
*   **Organic Blobs:** Background decorative elements should use the "blob" shape (asymmetrical border-radii) to break the rigidity of the grid.

### Input Fields
*   **Style:** Minimalist. Use `surface_container_highest` with a bottom-only `primary` accent line that glows when the field is focused. Labels should be `label-md` in `on_surface_variant`.

### Signature Component: The Kanji Focus Card
A large `xl` rounded card using the "Liquid Glass" effect. The background features a slow-moving, organic neon blob that shifts behind the Kanji character. The character itself is rendered in `display-lg`, utilizing `secondary` (Cyan) for a "precision" feel.

---

## 6. Do’s and Don’ts

### Do:
*   **Embrace Negative Space:** Let the "Darknight" background breathe. High-end design is defined by what you leave out.
*   **Layer with Intent:** Ensure that every glass overlay has a purpose, using `BlurView` to maintain focus on the top-most layer.
*   **Respect the Kanji:** Ensure stroke weight in Kanji characters is balanced with the `Manrope` font weights.

### Don't:
*   **No Pure Black:** Never use `#000000`. Use the `surface` midnight blues to keep the "Liquid" feel.
*   **No Hard Edges:** Avoid `none` or `sm` roundedness unless for technical data. Stick to `lg` (1rem) and `xl` (1.5rem) to maintain the organic vibe.
*   **No Standard Grids:** Avoid placing three icons in a perfectly centered row. Try offsetting them or using varying sizes to create a "curated" rather than "templated" look.