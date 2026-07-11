# Design QA — Research portrait scan

## Source visual truth

- Reference mask-and-outline word cloud: `/var/folders/mz/96fscqdd6nsfvtmhwldntlww0000gn/T/codex-clipboard-0e5471fc-2583-4e99-ba8f-332c41a1f360.png`
- Supplied half-body portrait: `/var/folders/mz/96fscqdd6nsfvtmhwldntlww0000gn/T/codex-clipboard-653249b8-ebf4-4069-bafe-40bc1085e5fa.png`

## Implementation evidence

- Desktop word-cloud state: `/Users/wangyitong/Desktop/HKUST/张可欣/portfolio/artifacts/design-qa/home-scan-desktop-wordcloud.png`
- Desktop 49% scan state: `/Users/wangyitong/Desktop/HKUST/张可欣/portfolio/artifacts/design-qa/home-scan-desktop-mixed.png`
- Mobile word-cloud state: `/Users/wangyitong/Desktop/HKUST/张可欣/portfolio/artifacts/design-qa/home-scan-mobile-wordcloud.png`
- Mobile 75% drag state: `/Users/wangyitong/Desktop/HKUST/张可欣/portfolio/artifacts/design-qa/home-scan-mobile-mixed.png`
- Focused source/implementation comparison: `/Users/wangyitong/Desktop/HKUST/张可欣/portfolio/artifacts/design-qa/wordcloud-reference-comparison.png`

## Viewports and states

- Desktop: 1280 × 720, Home, full word cloud and 49% portrait reveal.
- Mobile: 390 × 844, Home, full word cloud and 75% portrait reveal.
- The page remains one viewport at both sizes: desktop 1280 × 720 and mobile 390 × 844 reported no horizontal or vertical document overflow.

## Primary interactions tested

- Mouse position maps continuously from 0% word-cloud state to 100% portrait state.
- Moving outside the portrait resets to the complete word cloud.
- Touch-style drag updates the reveal to 75% without triggering page navigation; URL remains `#home`.
- Keyboard focus exposes slider semantics; ArrowRight changes the reveal from 0 to 8 while the page remains on `#home`; Home restores 0.
- Console errors checked after rendering and interaction: none.

## Full-view comparison evidence

The full desktop and mobile captures preserve the existing one-page portfolio composition. The new portrait remains contained within the original right-hand home-card allocation and does not displace the name, statement, navigation, or page controls.

## Focused comparison evidence

The combined comparison image verifies the reference's important visual rules: a real silhouette mask, intact words, strong size hierarchy, sparse readable placement, and a separate transparent outline. The implementation intentionally changes the palette and typeface to the portfolio's existing coral, sage, periwinkle, warm-white, and condensed editorial typography.

## Required fidelity surfaces

- Fonts and typography: the chart uses the loaded Roboto Condensed family at weight 800; large research terms lead, with smaller supporting terms remaining legible. No word is clipped by the silhouette mask.
- Spacing and layout rhythm: the 4:5 visual stays within 416 × 520 on desktop and 212 × 265 on mobile; the full page remains one viewport.
- Colors and visual tokens: existing portfolio colors are reused; the scan line uses a restrained warm-white/coral glow and the silhouette outline uses sage.
- Image quality and asset fidelity: portrait, mask, outline, and word cloud share the same 1200 × 1500 crop. The outline is a raster layer derived from the person mask and remains aligned during scanning.
- Copy and content: all visible terms were verified against the Character Attachment dissertation; the only instruction is the compact “Slide to reveal” prompt.

## Comparison history

- Earlier P1: the static cloud was too dense, its edge was approximate, and the font felt insufficiently angular. Fixed by replacing the static layout with `echarts-wordcloud` using the real `maskImage`, reducing the dataset to 43 weighted dissertation terms, loading a condensed heavy font, and adding a matching transparent raster outline.
- Earlier P2: the scan could remain partially revealed after the pointer left the component. Fixed with an outside-pointer reset and verified at 0% after exit.
- Post-fix evidence: desktop and mobile captures listed above; no remaining actionable P0/P1/P2 issue was found.

## Follow-up polish

- P3: future copy changes to the dissertation vocabulary may require minor weight adjustments to retain the current silhouette balance.

final result: passed

## Project-page navigation refactor — 2026-07-12

- Reference: user-provided navigation crop and instruction to replace Work / Practice with four project areas.
- Implemented: four direct project navigation entries and one full-screen page per project.
- Verified at 1280 × 720: Anchor route renders as a single project page; document dimensions exactly match the viewport.
- Navigation order verified: Home, Anchor, Attachment, FPS Study, AI × Library, Profile, Contact.
- Console errors: none.
- Final result: passed.

## Attachment dialogue layout — 2026-07-12

- Replaced the repeated card stack with three asymmetric speech-style evidence blocks anchored to the character research context.
- Moved the project title to the top of the composition and kept the study frame as one compact note.
- Dialogue content maps directly to the dissertation's Kaveh, Ningguang, and Necrologist interview examples.
- Final result: passed.

## Attachment content-grounded overview — 2026-07-12

- Re-read the full MA dissertation and grounded the overview in its actual sample: 10 dedicated players discussing non-customisable characters across Genshin Impact, Fate/Grand Order, Tears of Themis, Ensemble Stars, Reverse: 1999, and Ashes of the Kingdom.
- Reframed the overview around the study's actual mechanism: attraction, interaction feedback, reciprocal care, and extension into everyday life; task strength is explicitly secondary.
- Replaced full card screenshots with transparent character assets for Kaveh, Ningguang, and Necrologist, all characters explicitly discussed by interview participants.
- Reduced headline scale and balanced the title region against the character composition.
- Builds and automated viewport tests pass.
- Final result: passed.

## Project UI v2 — 2026-07-12

- Removed the full-page coloured project container.
- Reassigned each project colour to modular title, metric, detail, and evidence cards.
- Added two internal project pages (overview and evidence) with independent glass previous/next controls anchored to the lower corners.
- Constrained every project stage and evidence lane to the available viewport; no document-level scrolling was introduced.
- Builds and automated single-viewport tests pass.
- Final result: passed.

## Embedded project evidence — 2026-07-12

- Moved project descriptions, methods/findings, tags, metrics, and research visualizations from project dialogs into their corresponding full-screen project pages.
- Project dialog rendering has been removed; the remaining dialog is used only for the separate storytelling section.
- Static build and rendered HTML tests pass; document-level single-viewport constraints remain covered by the existing test suite.
- Final result: passed.
