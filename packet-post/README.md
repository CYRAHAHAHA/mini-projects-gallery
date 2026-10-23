# Packet Post

A tiny postman. A colorful cube world of distinct network devices. A cozy, scrolling 2.5D browser game that teaches networking through six packet deliveries and sixteen home-server repair challenges, written in vanilla HTML, CSS, and JavaScript.

## Play

Mira needs help preparing a neighborhood picnic. Carry six requests across independent maps, from welcoming a new computer to confirming the bakery’s order over HTTPS. Each briefing explains why the packet matters and where to go next. Maps introduce 2, 3, 4, 3, 4, and 4 devices as networking tasks become more complex.

Move immediately in the selected map. **Menu → Choose a level** opens any map; **Replay this level** resets its delivery. The briefing stays above the map, and labels identify the next stop or nearby device. Optional **Show lesson signs** reveals the current map’s relevant explanation.
- Move with WASD or arrow keys; click or tap open ground to walk there.
- Stand near a mailbox or service and press E or Space, or use the interaction button.
- On phones, use the on-screen direction buttons.
- Consult your packet’s destination, the hint button, and the Field guide.

There is no timer. Cleared levels and the selected map save in this browser when local storage is available. Older delivery progress is preserved; entering a map resets forwarding and DNS state. Sound is optional and off by default. The Field guide includes a fresh-start button.

The route introduces packets and IP addresses, a /24 subnet, a default gateway and router, a DNS A-record lookup, and TCP destination port 443 for HTTPS. Hostnames and addresses are illustrative. The postman represents delivery; envelopes represent packets. The map’s spatial boundary is a visual aid, not a definition of a subnet.

## Build a home server in the workshop

Choose **Menu → Home server**.

Each problem gives you a concrete goal. Send a simulated HTTP request, read the chronological trace, change a setting, and retry. The sixteen challenges cover localhost, LAN access, binding, scoped firewall rules, API GET/POST and JSON, a private database, DHCP reservations, sleep, automatic service startup, tested backups, local DNS, VPN access behind CGNAT, and HTTPS. The last challenge requires independently restoring both a website and saved API data.

Use optional predictions, worked examples, progressively revealed hints, and your own explanations. Your workshop progress and notebook save separately from the original packet route. Each challenge sets up a new scenario; your personal note carries forward. Revisit completed challenges with the route selector.

This is a simulation. It makes no requests to the entered URLs and changes no real network settings. A preconfigured VPN and trusted local certificate are teaching assumptions in the later exercises. This is preparation for OS-specific setup, not a real server installer. The game itself remains a static site.

Pedagogy references: [IES: Organizing Instruction and Study](https://ies.ed.gov/ncee/wwc/PracticeGuide/1) and [Carnegie Mellon learning principles](https://www.cmu.edu/teaching/principles/learning.html). Technical next step: [MDN local testing server](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Tools_and_setup/set_up_a_local_testing_server). The game has not been evaluated for learning outcomes.

## Run locally

No package installation or build is required. ES modules need an HTTP server:

```sh
cd packet-post
python3 -m http.server 8000
```

Open http://localhost:8000. Node.js 22 or newer can run `npm test` for lesson and gameplay logic checks. They include signboard clearance from device name/IP plaques. These checks execute the actual gameplay code against a minimal DOM; they do not replace a real browser rendering check.

## GitHub Pages

The published game lives in an isolated `packet-post/` directory in `CYRAHAHAHA/mini-projects-gallery`, using that repository’s existing Pages workflow. The gallery homepage is untouched.

For a standalone repository, push this source to a public repository’s `main` branch, then choose **Settings → Pages → Build and deployment → Source → GitHub Actions**. The included `.github/workflows/pages.yml` verifies the lessons, packages the static files, and deploys the game. All asset URLs are relative, so repository subpaths work.

## Files

- `index.html`, `style.css`: responsive dispatch interface and accessible controls.
- `game.js`: Canvas world, SVG sprite rendering, ground geometry, character, collision, navigation, interactions, audio, and persistence.
- `lessons.js`: six narrative requests and networking explanations.
- `trail.js`, `world.css`: lesson-sign catalog and the task briefing, Menu, and map interface.
- `server-lab.js`: deterministic home-server simulation and sixteen problem definitions.
- `workshop.js`, `workshop.css`: workshop controller, persistence, and responsive interface.
- `tests/`: subnet and original-route checks, all sixteen workshop repairs, failure-mode checks, and workshop controller/save-resume tests.
- `assets/sprites/`: thirteen authored SVG sprites for nine network landmarks, trees, signs, mailboxes, and the courier. `scripts/build-sprites.py` regenerates them; no build is needed to play.
- `assets/fonts/`: self-hosted DM Sans and Outfit, with their SIL Open Font Licenses.

No analytics, account, backend, external runtime dependencies, or remote font requests. Original game source is MIT licensed; font licenses are separate.


## Music, camera, and walking

An original 96 BPM pentatonic electronic score uses Web Audio: quiet triangle arpeggios, sine bass, and a bell-like melody over a 16-bar loop. It starts after a user gesture; the sound button mutes music and effects together and remembers the preference. Pause and hidden tabs suspend audio. Nodes disconnect after playback and a short scheduling horizon prevents a backlog after inactivity.

Camera following clamps to the world rectangle independently of player movement. Resize updates the bounds and minimum zoom to cover extreme aspect ratios. The postman uses eight SVG walking poses at 12 frames/second, alternating lifted feet and counter-swinging arms, a slight body bounce, and horizontal facing. Idle, blocked movement, and reduced-motion preference use the still pose.

Regression checks cover camera containment, movement at a clamped edge, audio scheduling, context reuse, and mute/resume. Native Canvas world and walking-pose captures were inspected. Browser audio listening and touch behavior remain unverified.

Review of the independent-map redesign is pending. Native Canvas captures cover world artwork only; browser HUD rendering and real device behavior remain unverified.

The final code review resolved keyboard level selection, independent completion markers, glossary availability, and map hints. Native Canvas map captures were inspected; full browser UI remains unverified.
