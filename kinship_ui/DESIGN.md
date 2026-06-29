---
name: Kinship UI
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#404750'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#707882'
  outline-variant: '#c0c7d2'
  surface-tint: '#00639c'
  primary: '#00629c'
  on-primary: '#ffffff'
  primary-container: '#0e7cc1'
  on-primary-container: '#00050e'
  inverse-primary: '#98cbff'
  secondary: '#674bb5'
  on-secondary: '#ffffff'
  secondary-container: '#ab8ffe'
  on-secondary-container: '#3f1e8c'
  tertiary: '#904800'
  on-tertiary: '#ffffff'
  tertiary-container: '#b55d00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cfe5ff'
  primary-fixed-dim: '#98cbff'
  on-primary-fixed: '#001d33'
  on-primary-fixed-variant: '#004a77'
  secondary-fixed: '#e8ddff'
  secondary-fixed-dim: '#cebdff'
  on-secondary-fixed: '#21005e'
  on-secondary-fixed-variant: '#4f319c'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#713700'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  title-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 20px
  lg: 32px
  xl: 48px
  container-margin: 24px
  gutter: 16px
---

## Brand & Style

The design system is centered on the "Digital Refrigerator" philosophy—a shared, communal space that feels organized yet warm and lived-in. It targets a multi-generational household, balancing the professional needs of parents with the high-energy, visual-first expectations of children.

The style is a blend of **Modern Minimalism** and **Tactile Playfulness**. It utilizes a clean "whiteboard" backdrop to ensure information density remains manageable, while employing soft depth and vibrant splashes of color to denote individual family members. The emotional response is one of clarity, reliability, and domestic harmony.

## Colors

The palette uses a crisp **Off-White (#F8F9FA)** base to emulate a clean home command center. The **Primary Teal-Blue** acts as the system anchor, used for global navigation and primary actions.

To handle the complexity of five different schedules and task lists, the design system employs a "Color-Coding Identity" logic. Each family member is assigned a high-saturation, soft-tone hue. These secondary colors are never used for system-level feedback; they are strictly reserved for personal data (avatars, calendar blocks, and task ownership). Accent colors for success and error states are slightly desaturated to remain legible without feeling aggressive in a domestic context.

## Typography

This design system utilizes **Plus Jakarta Sans** for its friendly, open counters and modern geometric construction. It strikes a balance between the playfulness of Quicksand and the professional utility of Inter.

- **Scale:** Bold, oversized headers are used to create clear entry points for busy users. 
- **Readability:** Body text maintains a generous line height (1.5x) to ensure legibility on the move.
- **Hierarchy:** Use `label-caps` for metadata like "POSTED BY" or "DUE DATE" to differentiate from primary content.
- **Mobile Adaptation:** Headlines scale down significantly on mobile to prevent awkward text wrapping in tight "card" layouts.

## Layout & Spacing

The design system uses a **Fluid Grid** model with high internal padding to prevent the UI from feeling "cluttered."

- **Safe Zones:** A 24px outer margin is maintained on all mobile screens to ensure touch targets don't hit the bezel, accommodating both small hands (children) and one-handed operation (parents).
- **Rhythm:** Spacing follows an 8px scale. Use `md (20px)` for internal card padding and `lg (32px)` for section separation.
- **Content Blocks:** Information is grouped into "Chalkboard Tiles"—modular units that can span full width on mobile or form a 3-column masonry grid on tablets and desktop dashboards.

## Elevation & Depth

Visual hierarchy is established through a **Layered Card** approach. 

1. **Level 0 (Canvas):** The off-white background.
2. **Level 1 (Cards):** Pure white surfaces with a soft, 10% opacity shadow (12px blur, 4px Y-offset). This creates a "sticky note" effect where cards feel physically placed on a surface.
3. **Level 2 (Interactive/Active):** When a user drags a task or interacts with a card, the shadow deepens and the scale increases by 2% to provide tactile feedback.

Avoid heavy borders. Use subtle, 1px strokes in a slightly darker gray only when cards overlap on similar backgrounds.

## Shapes

The design system favors highly organic, approachable shapes. 

- **Standard Radius:** 16px (`rounded-lg`) is the baseline for all cards and containers.
- **Interactive Elements:** Buttons and Input fields use a 12px radius to feel substantial but distinct from the container.
- **Avatars:** Always circular to provide a soft contrast against the predominantly rectangular card layout.
- **Icons:** Use a consistent 2px stroke weight with rounded terminals (caps and joins) to match the typography.

## Components

### Buttons
Primary buttons are high-contrast Teal-Blue with white text. They feature a minimum height of 48px to ensure easy tapping. Secondary buttons use a light tint of the primary color.

### Activity Chips
Small, pill-shaped indicators used for tagging categories (e.g., "Grocery," "Soccer," "School"). These use a semi-transparent version of the family member's secondary color to indicate ownership without overwhelming the visual field.

### Member Cards
The core of the system. These cards contain a family member's avatar in the top right, a bold title, and a "soft-edge" progress bar. The left border of the card is a 6px vertical stripe of that member's specific color.

### Input Fields
Fields are represented as soft-gray troughs that turn white with a primary-colored border on focus. Labels always remain visible (floating or top-aligned) to help younger users navigate complex forms.

### Checkboxes & Radio Buttons
Oversized (24x24px) with a heavy 2px border. When checked, they fill with the primary color and provide a subtle "haptic-style" bounce animation to signify completion.