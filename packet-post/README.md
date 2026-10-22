# Packet Post

A tiny postman. A big connected world. A cozy, scrolling 2.5D browser game that teaches networking through six packet deliveries, written in vanilla HTML, CSS, and JavaScript.

## Play

- Move with WASD or arrow keys; click or tap open ground to walk there.
- Stand near a mailbox or service and press E or Space, or use the interaction button.
- On phones, use the on-screen direction buttons.
- Consult your packet’s destination, the hint button, and the Field guide.

There is no timer. Completed deliveries save in this browser when local storage is available. Sound is optional and off by default. The Field guide includes a fresh-start button.

The route introduces packets and IP addresses, a /24 subnet, a default gateway and router, a DNS A-record lookup, and TCP destination port 443 for HTTPS. Hostnames and addresses are illustrative. The postman represents delivery; envelopes represent packets. The map’s spatial boundary is a visual aid, not a definition of a subnet.

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
- `tests/`: subnet checks and six-delivery gameplay checks.
- `assets/fonts/`: self-hosted DM Sans and Outfit, with their SIL Open Font Licenses.

No analytics, account, backend, external runtime dependencies, or remote font requests. Original game source is MIT licensed; font licenses are separate.
