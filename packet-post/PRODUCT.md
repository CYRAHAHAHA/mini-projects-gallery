# Packet Post

Teach beginner networking through intuitive deliveries in a cute scrolling town. The player is a postman representing packet delivery. Keep authentic technical terms and introduce each through action and feedback. Start small and expand the world gradually.

Audience: curious beginners on desktop and phones. No timer, lives, punishment, account, or network access required for gameplay. Vanilla HTML/CSS/JavaScript and static GitHub Pages hosting are requirements.

Six deliveries introduce packet/IP address, local subnet, /24 prefix, default gateway/router, DNS, and TCP port 443. The first three deliveries remain in 192.168.1.0/24; the next three reach 192.168.2.0/24. Routing and DNS prerequisites are enforced. Packet addresses, hostnames, payloads, and the town are fictional teaching examples.

Success: a player learns a term through a meaningful action, completes the route without prior networking knowledge, and can reread unlocked definitions. Persist completed deliveries locally; provide restart, hints, touch controls, keyboard controls, optional sound, pause, and reduced-motion support.

## Home Server Workshop

The user’s practical goal is to turn an old laptop into a website, API, or database host, starting with no prior knowledge. Add a problem-solving workshop alongside the original route, reachable from Menu. Preserve packet-delivery progress independently of workshop progress.

Sixteen workshop scenarios: start a localhost website; correct a phone’s localhost destination; fix the bind address; allow a specific LAN firewall port; start an API; create a note with POST; repair the API’s database dependency; read the note using GET; reserve and renew a DHCP lease; prevent sleep; verify automatic startup after reboot; test backup/loss/restore; configure local DNS; connect a preconfigured VPN behind CGNAT; enable a simulated HTTPS reverse proxy; repair a multi-fault capstone with separate website and API verification.

Pedagogy: a concrete goal precedes each attempt; predictable simulation behavior allows change-and-retry; chronological traces identify the first failure; three optional hints progressively reveal more help; worked-example text supports beginners; optional predictions and self-explanations support reflection; later tasks reuse prior skills. There is no timer, score penalty, or forced quiz. These are research-informed design choices, not evidence this game has been evaluated.

Workshop storage is independent of the original game. Store current scenario, configuration, request, hints, attempts, saved note, solved status, and reflections. Each challenge supplies its own scenario; learner notes carry forward. Completed problems can be replayed. No real server, VPN, firewall, certificate, or database is configured; nothing is sent to the supplied URLs. Full setup, OS installation, containers, public deployment, authentication, and production operations remain outside this release.

## Independent delivery maps

Six selectable, replayable maps introduce increasing routing complexity, with 2, 3, 4, 3, 4, and 4 devices respectively. Mira dispatches every packet from 192.168.1.2: welcome Niko, invite Jo, print a picnic poster, send Bea the headcount, resolve the bakery’s hostname, and confirm the order through HTTPS. Each request states a purpose, next stop, and destination; the recipient’s reply explains the networking action.

Start immediately in the selected map. Entering or replaying a level resets position, navigation, forwarding, DNS resolution, and delivery feedback. Completed levels and the current selection persist; older completion counts migrate into cleared levels while the selected map starts at level one. Workshop and sign discoveries keep their separate saves.

Let the map fill the screen at 100dvh. Float Menu in the upper-right corner; its translucent black slideout contains optional tools. A lower-left envelope opens the dispatch at each level start, folds when the courier walks, and reopens with its button. Keep the current objective visible on the compact envelope; show optional packet details in a dark drawer. Show map labels only for the next target or nearby device. Lesson signs are hidden initially; enabling them reveals only the current level’s relevant sign. Retain previously discovered explanations in the Field guide. Straight roads and mailbox access spurs share centerlines; the bridge matches the road width. Preserve cube SVG artwork, walking animation, camera bounds, optional music, touch controls, and the sixteen-problem workshop, reached through Menu.
