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
