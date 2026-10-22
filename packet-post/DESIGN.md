# Packet Post visual system

The game is the main experience: a colorful toy town rendered live on Canvas with rounded extruded houses, saturated roof colors, contrasting IP labels, a river crossing, reachable mailboxes, and a blue-uniformed animated postman. The map fills the town viewport. A compact packet HUD opens optional delivery details; signboard lessons live in the world. Toolbar actions stay secondary to exploration.

## Tokens

| Token | Value | Use |
|---|---|---|
| paper | #faf7ef | UI background |
| ink | #303e37 | Primary text |
| muted | #697169 | Secondary text |
| orange | #bd4c30 | Actions and brand |
| sage | #e4ebd9 | Supporting surfaces |
| line | #e4e4d8 | Dividers |
| meadow | #86d66d | World ground |
| path | #ffe4a2 | Walkable paths |
| water | #42bce2 | Network crossing |

Outfit 500–700 supplies rounded display lettering; DM Sans 400–700 supplies controls and body text; monospace is limited to IP addresses and port data. Fonts are self-hosted. Main title: 32px; game toolbar labels: 14px; mission title: 13px; supporting mission copy: 11px. Mobile mission copy: 10px. Canvas labels scale with the map.

Desktop: 76px header and full-width Canvas in the remaining viewport. The 310px dispatch drawer starts hidden and opens from the packet HUD. At <=760px: 66px header, full-height map, touch direction pad, context-sensitive interaction button, and compact floating HUD. The drawer and signboard reading panel scroll within available height. The footer is hidden. Game art remains procedural and resolution independent. There are no raster assets.

Warm paper HUD panels sit over bright grass and water. Houses use coral, turquoise, violet, gold, and blue roofs, rounded walls, curved roof corners, and dark outlines. Spatial depth comes from extruded walls, ground shadows, depth sorting, and character-following camera movement. Clearings protect signboard and address readability. World surfaces use grass #86d66d, paths #ffe4a2, water #42bce2, and ink #173e3c; panel paper is #fffdf3.

Motion is functional: walking, following camera, river movement, and a short delivery celebration. Reduced-motion settings remove character bob and water oscillation. Visible keyboard focus, named icon buttons, semantic dialogs, status messages, and focused delivery feedback support the HTML interface. Canvas exploration still requires visual navigation; full nonvisual gameplay is outside this release.

Verification: lesson and gameplay logic checks plus a fresh static review. The actual Canvas renderer was captured at desktop 1440×824, mobile 390×778, and a remote-network view using a native Canvas runtime. These inspect world artwork, not the HTML HUD. Full browser UI rendering and device behavior remain unverified.

## Home Server Workshop surface

The workshop extends the existing world with a 290px mission rail and a scrollable sage/cream bench. At <=1200px, the rail is 270px and trace/settings stack. At <=760px the workshop becomes an ordinary scrollable document: task, request form, trace, settings, and explanation. The town is paused while the workshop is open.

The primary loop is request → observe → change → retry, with a labeled phone/laptop/database route and one short envelope animation per request; reduced-motion removes that animation. Database elements appear when storage is introduced. Settings are scoped to the current problem rather than exposing an entire server admin panel at once. The page uses inherited colors and self-hosted fonts. Workshop heading 32px, task heading 24px, bench heading 22px, body 12–13px, supporting copy 10–11px. Mobile form inputs use 16px where practical; URLs and JSON use monospace. All user strings render through textContent or form values.

Inline success feedback receives keyboard focus, includes practical transfer guidance, and offers an optional explanation field. The Field guide contains a glossary, repair notebook, and links to IES, Carnegie Mellon, and MDN references. Preserve visible focus and semantic labels; no modal interrupts an ordinary repair.

Verification includes engine checks for all sixteen problems, failure distinctions, JSON validation, private database boundaries, backup independence, autostart testing, VPN/CGNAT/TLS behavior, and controller checks for completion, resume without duplicate writes, hints, and storage denial. Browser visual and real device testing remain unavailable in this environment.

## Signboard exploration

Start immediately in control, without a welcome gate. The whole map is explorable, including the bridge; packet delivery prerequisites still apply. Next delivery leaves the character in place. Reading a sign and viewing a delivery success never block movement.

Fifteen rounded, color-coded signboards introduce packet/IP, localhost, subnet/gateway, firewall, server process, DHCP, DNS, ports, HTTP, database, VPN/CGNAT, backup, and HTTPS. Near a board, E or tap opens an optional reading panel with an experiment and a walk-to-target button. Discoveries persist independently under packet-post-trail-v1 and appear in the field guide. Titles are readable in-world; longer explanations use semantic HTML. No score or mastery claim is attached to discovery.

World geometry is rendered procedurally; native QA captures live under .impeccable/review and are not shipping assets. Runtime remains dependency-free vanilla HTML/CSS/JS. Native Canvas was used only for QA.

Separate finish-review initialization was unavailable for this update. A bounded in-thread review, regression checks, contrast calculation, and native Canvas captures were used; no full-browser visual approval is claimed.
