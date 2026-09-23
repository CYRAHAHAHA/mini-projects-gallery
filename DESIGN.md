---
name: Mini Projects Gallery
description: A compact public shelf for practical browser tools.
colors:
  night: "#0d1b2a"
  night-soft: "#13263a"
  ink: "#eef5f8"
  muted: "#b8c5ce"
  focus: "#ffe66d"
  surface-ink: "#102131"
  surface-muted: "#445663"
  commute-art: "#c0d9ed"
  commute-surface: "#edf7ff"
  sticker-art: "#ffcf5c"
  sticker-surface: "#fff4d5"
  home-art: "#a7dbb3"
  home-surface: "#eff8e9"
typography:
  display:
    fontFamily: "ui-rounded, Aptos, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 8vw, 3.8rem)"
    fontWeight: 850
    lineHeight: 0.88
    letterSpacing: "-0.04em"
  title:
    fontFamily: "ui-rounded, Aptos, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.65rem, 7vw, 2.2rem)"
    fontWeight: 850
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  body:
    fontFamily: "ui-rounded, Aptos, Segoe UI, system-ui, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.45
  label:
    fontFamily: "ui-rounded, Aptos, Segoe UI, system-ui, sans-serif"
    fontSize: "0.73rem"
    fontWeight: 800
    letterSpacing: "0.05em"
  micro:
    fontFamily: "ui-rounded, Aptos, Segoe UI, system-ui, sans-serif"
    fontSize: "0.55rem"
    fontWeight: 900
    letterSpacing: "0.05em"
rounded:
  project-card: "15px"
  label-sheet: "8px"
  label-cell: "4px"
  phone-shell: "22px"
spacing:
  edge: "1.5rem"
  card: "1.5rem"
  section: "clamp(4rem, 10vw, 8rem)"
components:
  project-card:
    backgroundColor: "{colors.commute-surface}"
    textColor: "{colors.night}"
    rounded: "{rounded.project-card}"
    padding: "{spacing.card}"
  primary-link:
    textColor: "{colors.night}"
    typography: "{typography.label}"
---

# Design System: Mini Projects Gallery

## Overview

**Creative North Star: "The Useful Tool Shelf"**

This is a phone-first directory for real browser tools. The framing stays deep and quiet; each project enters as a brightly coloured object with a purpose-built line illustration. It should feel like opening a concise, well-organised shelf rather than browsing a generic portfolio.

The layout earns attention through one plain-language title and a deliberate shift from the dark shared frame into each tool's distinct coloured environment. The page has no decorative background treatment, stock photography, labels, or visual noise that competes with the tools themselves.

**Key Characteristics:**

- Quiet navy frame with one compact high-contrast title.
- Each project is a colour-coded object, not an interchangeable content tile.
- Geometric line art explains the tool before the visitor reads the description.
- One visible action per project: open the live tool.

## Colors

The palette uses a stable dark frame and three cheerful, task-specific project worlds.

### Primary

- **Night Shelf:** the persistent page frame, headings, and strong link colour.
- **Clear Ink:** high-contrast copy on the dark frame.
- **Signal Focus:** keyboard-focus indicator and privacy-mark accent.

### Secondary

- **Commute Blue:** route and transit world for SUTD Commute Cost.
- **Label Yellow:** printed-paper world for Sticker Studio.
- **Home Green:** planning world for the BTO Budget Calculator.

### Neutral

- **Soft Ink:** secondary copy on the shared dark frame.
- **Tool Surfaces:** pale companion surfaces that preserve contrast within each project world.

**The Distinct Tool Rule.** Every project gets one coloured art field and one pale content field; do not introduce a fourth accent or blend the projects into one brand colour.

## Typography

**Display Font:** the shared UI-rounded system stack.
**Body Font:** the shared UI-rounded system stack.

**Character:** The typography is deliberately infrastructural: bold, friendly, and immediately readable without fetching a third-party font. Weight, scale, and tight-but-legible spacing provide the personality.

### Hierarchy

- **Display:** reserved for the opening statement and held to a compact two-line composition.
- **Title:** project names use the same heavy face and a compact line-height.
- **Body:** practical descriptions remain relaxed and concise, with a readable measure.
- **Label:** used only inside the sticker-sheet illustration.

**The Direct Language Rule.** Headings name the useful thing. Labels support orientation; they never become decorative copy.

## Layout

The content container is mobile-first. Phones use a single full-width vertical tool stack; at 700px and above, the first two cards share a row and the BTO card spans beneath them with its artwork and copy side by side. The page stays capped at 1180px so the grid remains compact rather than stretching across wide displays. The 1rem outer gap and 1.35rem card interiors keep touch reading comfortable.

The page should remain a short, scannable visit: one title, then the tools, with no desktop-only content.

## Elevation & Depth

The shelf is flat by default. Cards receive a soft, offset shadow and a modest upward movement only on hover, making the interaction feel like lifting an object from the shelf. Borders define edges at rest; no glass effects, ambient glows, or layered panels are used.

**The Lift Only on Intent Rule.** Depth is a response to a hover or focus interaction, never permanent decoration.

## Shapes

Project cards use gently rounded corners, while the interior drawings use crisp geometric strokes and simplified practical objects. Rounded label cells can be smaller, but the card silhouette remains the dominant shape. Do not introduce pills for non-compact controls.

## Components

### Project Cards

- **Character:** Each card is a compact product poster: an illustrative object above a small information panel.
- **Shape:** gentle card corner with a clear art/content divide.
- **Background:** one saturated art surface paired with its pale supporting surface.
- **Shadow Strategy:** flat at rest; low soft lift only on hover.
- **Internal Padding:** the card content stays inset by the standard card spacing token.

### Links

- **Primary:** bold, underlined action text with a small northeast arrow and a 44px minimum touch target.
- **Focus:** strong visible outline in the signal focus colour, offset away from the text.

### Privacy Note

- **Character:** compact reassurance, not a banner.
- **Style:** small outlined shield mark paired with one plain-language sentence.

## Do's and Don'ts

### Do:

- **Do** keep every card tied to a real project and a real deployment URL.
- **Do** author simple subject-specific SVG geometry when an icon helps explain a tool.
- **Do** preserve the dark shelf plus distinct coloured tool worlds as the collection grows.
- **Do** make keyboard focus and reduced-motion support visible in the implementation.

### Don't:

- **Don't** use generic portfolio thumbnails, stock-device mockups, or interchangeable icon cards.
- **Don't** add sign-up prompts, trackers, forms, user storage, or third-party font requests.
- **Don't** add decorative grid backgrounds, gradient text, glass panels, or floating metric widgets.
