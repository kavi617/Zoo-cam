# Implementation Plan - UI/UX Polish

## Goal
Improve the visual aesthetics and user experience of the Zoo Monitor Wall application. The target style is "Premium, Glassmorphism, Dynamic".

## Color Palette Refinement
We will stick to the earthy tones but apply them with more sophistication (transparency, gradients).
- **Background**: Deep Charcoal Brown (`#3f4739`) to Darker Brown gradient.
- **Glass Surfaces**: Dim Grey (`#717568`) with low opacity and blur.
- **Accents**: Peach Glow (`#f1bf98`) for active states/buttons.
- **Text**: Frosted Mint (`#e1f4cb`) and White.

## Typography
- **Headings**: `Outfit` (Modern, geometric, friendly).
- **Body**: `Inter` (Clean, legible).

## Component Updates

### 1. Global CSS (`src/app/globals.css`)
- Import `Outfit` and `Inter` from Google Fonts (via `layout.tsx`).
- Define refined CSS variables.
- Add `.glass-panel`, `.glass-button` utility classes.
- Add `@keyframes` for `entrance-up` and `pulse-glow`.

### 2. Layout (`src/app/layout.tsx`)
- Replace Geist with `Outfit` and `Inter`.
- Update `<body>` classes.

### 3. Main Page (`src/app/page.tsx`)
- **Header**:
  - Convert to a floating glass navbar.
  - Add a subtle logo animation.
- **Cam Grid**:
  - Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` with gap-8.
  - **Cards**:
    - Remove thick borders.
    - Use `backdrop-filter: blur(12px)`.
    - Rounded corners: `rounded-3xl`.
    - Hover effect: Scale 1.02, Shadow-2xl in primary color.
    - Title bar: Integrated into the card image overlay (gradient blackout at top) rather than a separate block.
- **Modal/Fullscreen**:
  - Full-screen blur backdrop.
  - Animated entry.
- **Controls**:
  - Floating action buttons (Cycle, Music) should be highly styled (glass + glow).

### 4. Video Component (`src/app/VideoWithFallback.tsx`)
- Ensure it fills the container with `object-cover` or `contain` based on context.
- Rounded corners to match parent.

## Execution Steps
1.  Update `layout.tsx` with new fonts.
2.  Rewamp `globals.css` with new variables and animations.
3.  Rewrite `page.tsx` with the new design structure.
4.  Verify visual integrity.
