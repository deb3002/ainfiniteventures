

## Add Animated AI Visual to Home Page Hero

### What changes
Add an animated, abstract AI-themed visual element to the hero section of the home page. This will be a custom SVG-based animation built with Framer Motion -- an animated neural network / interconnected nodes graphic that floats behind the hero text, giving the page a dynamic, modern feel without relying on external images.

### Design Approach
- Create a new `HeroAnimation` component with an animated network of glowing dots and connecting lines
- Dots will gently float/pulse, lines will fade in and out -- evoking AI and neural networks
- Uses the existing accent color (`hsl(200 60% 45%)`) for consistency
- Positioned behind the hero text with reduced opacity so it enhances without distracting
- Fully responsive and performant using Framer Motion (already installed)

### Technical Details

**New file: `src/components/HeroAnimation.tsx`**
- Renders an SVG with ~12-15 animated nodes (circles) at various positions
- Draws subtle connecting lines between nearby nodes
- Each node has a Framer Motion animation: gentle floating (y oscillation) and pulsing opacity
- Lines animate their opacity in a staggered pattern
- The whole SVG is absolutely positioned behind the hero content

**`src/pages/Index.tsx`**
- Import and place `<HeroAnimation />` inside the hero section, behind the text (using `relative` / `absolute` positioning)
- The hero section gets `relative overflow-hidden` to contain the animation
- Text content remains on top with `relative z-10`

No new dependencies needed -- uses Framer Motion which is already installed.
