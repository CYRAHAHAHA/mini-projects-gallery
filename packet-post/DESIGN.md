# Packet Post visual system

The game is the main experience: a colorful low-poly cube town rendered on Canvas with authored SVG sprites, distinct network-role landmarks, contrasting IP labels, a river crossing, reachable mailboxes, and a block-bodied animated postman. Six independent maps keep attention on one narrative request at a time. The Canvas fills the screen at 100dvh. A lower-left envelope unfolds the purpose and next stop; a floating upper-right Menu opens a translucent black slideout with optional tools, level selection, and replay.

## Tokens

| Token | Value | Use |
|---|---|---|
| paper | #faf7ef | UI background |
| ink | #303e37 | Primary text |
| muted | #697169 | Secondary text |
| orange | #bd4c30 | Actions and brand |
| sage | #e4ebd9 | Supporting surfaces |
| line | #e4e4d8 | Dividers |
| meadow | #8acb86 | World ground |
| path | #f8edcb | Road surface |
| water | #62c7d3 | Network crossing |

Outfit 500–700 supplies rounded display lettering; DM Sans 400–700 supplies controls and body text; monospace is limited to IP addresses and port data. Fonts are self-hosted. Menu controls use 14px text. Briefing typography is specified below; Canvas labels scale with the map.

The map occupies the full viewport with no reserved header or briefing region. The envelope opens at each level start, folds when walking begins, and reopens through its button; its compact caption retains the current objective. Desktop dispatch width is 355px, with a 25px title and 13px body. At <=760px the envelope is 310px wide and sits above touch controls; its title is 22px and body is 12px. The warm paper letter scrolls within 55dvh desktop / 47dvh mobile. Menu uses a 340px translucent black slideout, capped at 90vw; optional packet details use a dark 355px drawer capped at 94vw. Reading panels scroll within available height. The footer is hidden. Ground, roads, water, and labels are Canvas geometry; network devices and the courier use authored SVG assets. There are no shipping raster assets.

Warm paper dispatch letters and dark translucent controls float over grass and water. The nine-landmark asset catalog has distinct silhouettes and networking roles: packet depot, desktop client, phone client, network printer, old-laptop workshop, router/gateway, DNS directory, bakery web server, and remote host. Shared cube faces, consistent top/right lighting, plinths, ground shadows, depth sorting, and character-following camera movement establish 2.5D depth. Trees, signboards, mailboxes, and the postman complete the thirteen-sprite set. `scripts/build-sprites.py` authors the shipping files in `assets/sprites/`; no asset build is required to play.

Straight arterial roads connect access spurs on each mailbox’s centerline. Bridge and road widths match. All road borders are drawn before all road surfaces, so intersections remain continuous. Road interiors avoid every solid landmark footprint; the independent maps omit decorative trees. Ground uses #8acb86, road surfaces #f8edcb with #d9e6d3 curbs and #5e997e borders, and water #62c7d3 with #399db9 banks. Address panels use #fff9e7 with #173e4c address ink; sign faces use #fff8dc with #173e3c text. Sprite face palettes use cream, cyan, mint, violet, gold, and dark blue, with separate lit and shaded faces.

Motion is functional: walking, following camera, river movement, and a short delivery celebration. Reduced-motion settings remove character bob, water oscillation, and menu, letter, and details-drawer entrance animations. Visible keyboard focus, named icon buttons, semantic dialogs, status messages, and focused delivery feedback support the HTML interface. Canvas exploration still requires visual navigation; full nonvisual gameplay is outside this release.

Verification includes lesson and gameplay logic checks and road interiors avoiding building footprints. Native Canvas captures inspect world artwork; full browser UI rendering and device behavior remain unverified.

## Home Server Workshop surface

The workshop extends the existing world with a 290px mission rail and a scrollable sage/cream bench. At <=1200px, the rail is 270px and trace/settings stack. At <=760px the workshop becomes an ordinary scrollable document: task, request form, trace, settings, and explanation. The town is paused while the workshop is open.

The primary loop is request → observe → change → retry, with a labeled phone/laptop/database route and one short envelope animation per request; reduced-motion removes that animation. Database elements appear when storage is introduced. Settings are scoped to the current problem rather than exposing an entire server admin panel at once. The page uses inherited colors and self-hosted fonts. Workshop heading 32px, task heading 24px, bench heading 22px, body 12–13px, supporting copy 10–11px. Mobile form inputs use 16px where practical; URLs and JSON use monospace. All user strings render through textContent or form values.

Inline success feedback receives keyboard focus, includes practical transfer guidance, and offers an optional explanation field. The Field guide contains a glossary, repair notebook, and links to IES, Carnegie Mellon, and MDN references. Preserve visible focus and semantic labels; no modal interrupts an ordinary repair.

Verification includes engine checks for all sixteen problems, failure distinctions, JSON validation, private database boundaries, backup independence, autostart testing, VPN/CGNAT/TLS behavior, and controller checks for completion, resume without duplicate writes, hints, and storage denial. Browser visual and real device testing remain unavailable in this environment.

## Task and map hierarchy

Mira’s six picnic requests give each packet a purpose and a recipient reply. Maps contain 2, 3, 4, 3, 4, and 4 devices: a single address, address selection, local subnet, gateway, DNS lookup, and service port. Menu permits direct selection and replay. Each map entry clears transient routing and movement state and returns the courier to its depot. Cleared levels and the current selection are saved, with migration from the earlier completion count.

The default view shows only task landmarks, the current route, and target/nearby device labels. Optional lesson signs start hidden; enabling them shows one relevant sign for the current map. The fifteen-entry sign catalog and prior discoveries remain available to the Field guide, but fifteen boards no longer populate the world. Smaller boards show a single title; explanations use semantic HTML. Device plaques render after world objects and shift around the courier when a clear candidate exists. Redundant model captions are removed; desktop layering and the laptop keyboard plane remain corrected.

World artwork combines authored SVG sprites and Canvas ground geometry; native QA captures under .impeccable/review are not shipping assets. Runtime remains dependency-free vanilla HTML/CSS/JS.

Current level logic checks pass. Native Canvas captures inspect world artwork only. Source and native Canvas review of the full-screen refinement is complete; browser HUD rendering, audio listening, and real touch/device behavior remain unverified.

## Music, camera, and walking

An original 96 BPM pentatonic electronic score uses Web Audio: quiet triangle arpeggios, sine bass, and a bell-like melody over a 16-bar loop. It starts after a user gesture; the sound button mutes music and effects together and remembers the preference. Pause and hidden tabs suspend audio. Nodes disconnect after playback and a short scheduling horizon prevents a backlog after inactivity.

Camera following clamps to a skyline-derived top bound and a world height of 1200 units independently of player movement. A vertical dead zone from 25% to 72% of the viewport keeps the roads higher with open ground below; the camera follows vertically only outside that zone. Resize updates the bounds and minimum zoom to cover extreme aspect ratios. The postman uses eight SVG walking poses at 12 frames/second, alternating lifted feet and counter-swinging arms, a slight body bounce, and horizontal facing. Idle, blocked movement, and reduced-motion preference use the still pose.

Regression checks cover camera containment, movement at a clamped edge, audio scheduling, context reuse, and mute/resume. Native Canvas world and walking-pose captures were inspected. Browser audio listening and touch behavior remain unverified.

Mobile world text remains small; full browser behavior is unverified.

The final code review resolved keyboard level selection, independent completion markers, glossary availability, and map hints. Native Canvas map captures were inspected; full browser UI remains unverified.


## Packet learning update
Twelve selectable stages: six narrative deliveries followed by six independent networking decision exercises covering MAC, ARP, next-hop selection, routing-table lookup, TTL, and frame replacement. A wrong choice explains the mechanism and allows retry; correct choices at the receiver complete the stage. The satchel button opens source/destination/payload details, an explicitly illustrative curl request, lifecycle and router explanations, two-link MAC examples, and stage learning. Commands are never executed. Dispatch visibility is an explicit preference persisted independently and retained while walking or changing levels. Existing workshop remains available. Logic tests cover all advanced exercise completions and persistent dispatch; full browser UI testing remains unavailable.
