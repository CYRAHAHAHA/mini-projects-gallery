# Packet Post visual system

The game is the main experience: a warm toy town rendered live on Canvas with extruded houses, roof colors, legible IP labels, a river crossing, reachable mailboxes, and a small animated postman. The cream dispatch sidebar shows a stamped packet and one current delivery. Toolbar actions stay secondary to exploration.

## Tokens

| Token | Value | Use |
|---|---|---|
| paper | #faf7ef | UI background |
| ink | #303e37 | Primary text |
| muted | #697169 | Secondary text |
| orange | #bd4c30 | Actions and brand |
| sage | #e4ebd9 | Supporting surfaces |
| line | #e4e4d8 | Dividers |
| meadow | #dfe8c9 | World ground |
| path | #f0e6c8 | Walkable paths |
| water | #b5d6cf | Network crossing |

Outfit 500–700 supplies rounded display lettering; DM Sans 400–700 supplies controls and body text; monospace is limited to IP addresses and port data. Fonts are self-hosted. Main title: 32px; game toolbar labels: 14px; mission title: 13px; supporting mission copy: 11px. Mobile mission copy: 10px. Canvas labels scale with the map.

Desktop: 96px header, 306px dispatch sidebar, remaining viewport for Canvas, 48px footer. At <=760px: 74px header, world above a compact 220px dispatch panel, touch direction pad, and context-sensitive interaction button. Game art remains procedural and resolution independent. There are no raster assets.

Warm paper, muted foliage, coral accents, irregular stamp rotation, and restrained soft shadows carry the identity. Houses use coral, sage, lavender, ochre, and blue roofs. Spatial depth comes from extruded walls, ground shadows, depth sorting, and character-following camera movement.

Motion is functional: walking, following camera, river movement, and a short delivery celebration. Reduced-motion settings remove character bob and water oscillation. Visible keyboard focus, named icon buttons, semantic dialogs, status messages, and focused delivery feedback support the HTML interface. Canvas exploration still requires visual navigation; full nonvisual gameplay is outside this release.

Verification: lesson and gameplay logic checks plus a fresh static review. Real browser visual inspection was unavailable in this environment; responsive rendering and device behavior remain to be checked in a browser.

## Home Server Workshop surface

The workshop extends the existing world with a 290px mission rail and a scrollable sage/cream bench. At <=1200px, the rail is 270px and trace/settings stack. At <=760px the workshop becomes an ordinary scrollable document: task, request form, trace, settings, and explanation. The town is paused while the workshop is open.

The primary loop is request → observe → change → retry, with a labeled phone/laptop/database route and one short envelope animation per request; reduced-motion removes that animation. Database elements appear when storage is introduced. Settings are scoped to the current problem rather than exposing an entire server admin panel at once. The page uses inherited colors and self-hosted fonts. Workshop heading 32px, task heading 24px, bench heading 22px, body 12–13px, supporting copy 10–11px. Mobile form inputs use 16px where practical; URLs and JSON use monospace. All user strings render through textContent or form values.

Inline success feedback receives keyboard focus, includes practical transfer guidance, and offers an optional explanation field. The Field guide contains a glossary, repair notebook, and links to IES, Carnegie Mellon, and MDN references. Preserve visible focus and semantic labels; no modal interrupts an ordinary repair.

Verification includes engine checks for all sixteen problems, failure distinctions, JSON validation, private database boundaries, backup independence, autostart testing, VPN/CGNAT/TLS behavior, and controller checks for completion, resume without duplicate writes, hints, and storage denial. Browser visual and real device testing remain unavailable in this environment.
