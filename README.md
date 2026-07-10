# Kexin Zhang — Portfolio

A responsive, content-first portfolio for Kexin Zhang, built from the current
English academic CV. The site positions her work at the intersection of
narrative game design, player experience research, human-centered HCI, and
digital communication.

## Content boundaries

- Uses only facts supported by the current English CV.
- Publishes the contact email but not the phone number or unrelated personal data.
- Uses project-specific graphic systems as placeholders because no game
  screenshots, research charts, or media thumbnails were available.
- Does not overstate Kexin’s role as a full-stack game developer or artist.

## Local development

Requires Node.js 22.13 or later.

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal.

## Validation and deployment

```bash
npm run build
npm test
```

All portfolio content is static. The included vinext configuration produces a
Cloudflare Worker-compatible build for OpenAI Sites deployment.

## Updating the portfolio

The next content pass should prioritise:

1. Anchor screenshots, gameplay video, playable link, team credits, and tools.
2. Actual findings and visualisations from the FPS and KCL studies.
3. Links and thumbnails for the two journalism projects.
4. Confirmed public profiles such as LinkedIn, itch.io, GitHub, or Google Scholar.
5. A public CV PDF with the phone number removed.

See [RESEARCH.md](./RESEARCH.md) for the reference-site study that informed the
information architecture and motion direction.
