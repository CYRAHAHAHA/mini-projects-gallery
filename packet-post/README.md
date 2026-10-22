# Packet Post

A tiny postman. A colorful connected world. A cozy, scrolling 2.5D browser game that teaches networking through six packet deliveries and sixteen home-server repair challenges, written in vanilla HTML, CSS, and JavaScript.

## Play

You can move immediately when the page loads. Explore the whole map, read fifteen colorful signboards with E or a nearby tap, and collect their explanations in your Field guide. The packet HUD opens optional delivery details. The map stays playable while a sign is open; there is no opening menu or start gate.

- Move with WASD or arrow keys; click or tap open ground to walk there.
- Stand near a mailbox or service and press E or Space, or use the interaction button.
- On phones, use the on-screen direction buttons.
- Consult your packet’s destination, the hint button, and the Field guide.

There is no timer. Completed deliveries save in this browser when local storage is available. Sound is optional and off by default. The Field guide includes a fresh-start button.

The route introduces packets and IP addresses, a /24 subnet, a default gateway and router, a DNS A-record lookup, and TCP destination port 443 for HTTPS. Hostnames and addresses are illustrative. The postman represents delivery; envelopes represent packets. The map’s spatial boundary is a visual aid, not a definition of a subnet.

## Build a home server in the workshop

Choose the toolbar’s **Home server** control or visit the old laptop in town.

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

Open http://localhost:8000. Node.js 22 or newer can run `npm test` for lesson and gameplay logic checks. These checks execute the actual gameplay code against a minimal DOM; they do not replace a real browser rendering check.

## GitHub Pages

The published game lives in an isolated `packet-post/` directory in `CYRAHAHAHA/mini-projects-gallery`, using that repository’s existing Pages workflow. The gallery homepage is untouched.

For a standalone repository, push this source to a public repository’s `main` branch, then choose **Settings → Pages → Build and deployment → Source → GitHub Actions**. The included `.github/workflows/pages.yml` verifies the lessons, packages the static files, and deploys the game. All asset URLs are relative, so repository subpaths work.

## Files

- `index.html`, `style.css`: responsive dispatch interface and accessible controls.
- `game.js`: Canvas world, procedural scenery, character, collision, navigation, interactions, audio, and persistence.
- `lessons.js`: networking explanations and lesson progression.
- `trail.js`, `world.css`: fifteen in-world signboards and the colorful full-map interface.
- `server-lab.js`: deterministic home-server simulation and sixteen problem definitions.
- `workshop.js`, `workshop.css`: workshop controller, persistence, and responsive interface.
- `tests/`: subnet and original-route checks, all sixteen workshop repairs, failure-mode checks, and workshop controller/save-resume tests.
- `assets/fonts/`: self-hosted DM Sans and Outfit, with their SIL Open Font Licenses.

No analytics, account, backend, external runtime dependencies, or remote font requests. Original game source is MIT licensed; font licenses are separate.
