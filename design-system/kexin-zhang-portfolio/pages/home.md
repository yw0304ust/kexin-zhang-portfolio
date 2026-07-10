# Single-viewport portfolio override

This file overrides the generated master recommendations for the live portfolio.

- Architecture: five fixed viewport pages — Home, Work, Practice, Profile, Contact.
- Navigation: real hash links, previous/next controls, keyboard arrows, touch swipe.
- Motion: directional transform/opacity transition, 420ms maximum; no scroll-driven layout.
- Palette: ink `#121613`, warm paper `#f3f1ea`, coral `#ee6a45`, with sage and pale blue project surfaces.
- Glass: only the small Email/CTA pills and bottom page controls; the top navigation is transparent and editorial.
- Content surfaces: opaque or transparent editorial fields; never all-over glassmorphism.
- Accessibility: visible focus, `aria-current`, inactive pages use `inert` and `aria-hidden`, reduced-motion removes spatial transforms.
