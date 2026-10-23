# Packet Post

Teach beginner networking through intuitive deliveries in a cute scrolling town. The player is a postman representing packet delivery. Keep authentic technical terms and introduce each through action and feedback. Start small and expand the world gradually.

Audience: curious beginners on desktop and phones. No timer, lives, punishment, account, or network access required for gameplay. Vanilla HTML/CSS/JavaScript and static GitHub Pages hosting are requirements.

Six deliveries introduce packet/IP address, local subnet, /24 prefix, default gateway/router, DNS, and TCP port 443. The first three deliveries remain in 192.168.1.0/24; the next three reach 192.168.2.0/24. Routing and DNS prerequisites are enforced. Packet addresses, hostnames, payloads, and the town are fictional teaching examples.

Success: a player learns a term through a meaningful action, completes the route without prior networking knowledge, and can reread unlocked definitions. Persist completed deliveries locally; provide restart, hints, touch controls, keyboard controls, optional sound, pause, and reduced-motion support.

## Home Server Workshop

The user’s practical goal is to turn an old laptop into a website, API, or database host, starting with no prior knowledge. Add a problem-solving workshop alongside the original route, reachable from the toolbar or old-laptop building. Preserve the original town and its saved progress.

Sixteen workshop scenarios: start a localhost website; correct a phone’s localhost destination; fix the bind address; allow a specific LAN firewall port; start an API; create a note with POST; repair the API’s database dependency; read the note using GET; reserve and renew a DHCP lease; prevent sleep; verify automatic startup after reboot; test backup/loss/restore; configure local DNS; connect a preconfigured VPN behind CGNAT; enable a simulated HTTPS reverse proxy; repair a multi-fault capstone with separate website and API verification.

Pedagogy: a concrete goal precedes each attempt; predictable simulation behavior allows change-and-retry; chronological traces identify the first failure; three optional hints progressively reveal more help; worked-example text supports beginners; optional predictions and self-explanations support reflection; later tasks reuse prior skills. There is no timer, score penalty, or forced quiz. These are research-informed design choices, not evidence this game has been evaluated.

Workshop storage is independent of the original game. Store current scenario, configuration, request, hints, attempts, saved note, solved status, and reflections. Each challenge supplies its own scenario; learner notes carry forward. Completed problems can be replayed. No real server, VPN, firewall, certificate, or database is configured; nothing is sent to the supplied URLs. Full setup, OS installation, containers, public deployment, authentication, and production operations remain outside this release.

## Play-first world update

The user explicitly asked for immediate map movement, more game-like exploration, signboard lessons throughout, more color and contrast, and rounded scenery. Start the postman already active; remove the welcome gate and fixed dispatch sidebar. Keep the map primary with floating HUD controls. All areas are explorable from the start; packets for remote subnets still require gateway forwarding. Retain six deliveries and the optional sixteen-problem workshop.

Add fifteen in-world signboards with nearby E/tap reading, contextual experiments, persistent discovery, and field-guide recall. Reading is optional and nonblocking. Preserve player position between deliveries and allow movement during delivery feedback. Signboard discovery, original route progress, and workshop progress use separate storage keys.

## Cube-world visual brief

The user requested SVG sprites with a low-poly cube 3D appearance, meaningful differences between network roles instead of repeated houses, and aligned roads. Represent the nine destinations as a packet depot, desktop, phone, printer, old laptop, router, DNS directory, bakery web server, and remote host. Use a consistent cube style for the courier, trees, signs, and mailboxes, with straight connected arterial roads and access spurs that avoid building footprints.

This visual redesign preserves immediate gameplay, six deliveries, fifteen discoverable signs, and the sixteen-scenario Home Server Workshop, including their independent saved progress. Ship static SVG assets drawn on Canvas with no new runtime dependencies.
