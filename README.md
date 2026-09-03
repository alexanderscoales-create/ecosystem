# ARES

A visual-only interface for an AI-run habitat. The first screen is the habitat
itself — a full-viewport painterly diorama of a fortified city built around a
central tower. There is no landing page, no HUD, no sidebar. The image is the
interface.

Hovering a structure blooms a soft highlight over it and raises a small label
card. Clicking one cross-fades into that room's interior with a slight scale-in,
so it reads as stepping into the space. A back control and <kbd>Esc</kbd> return
to the habitat.

React + TypeScript + Vite. DOM and CSS only: layered images, absolute
positioning, CSS animation, React state for view switching, hover and selection.

## Running it

```
npm install
npm run dev      # regenerates the art, then starts Vite
npm run build
```

## The eight rooms

| Room | Structure | Agent |
| --- | --- | --- |
| The Bridge | Penthouse of the central tower | JARVIS, Orchestrator |
| Commerce Lab | Open fabrication hall at the tower base | FRIDAY, Commerce Fabricator |
| Content Engine | Half-buried hangar | KAREN, Replication Lead |
| Media Bay | Printing house with tall arched windows | EDITH, Media Compositor |
| Research Lab | Vine-wrapped glass observation dome | CEREBRA, Signal Analyst |
| Treasury | Gold-doored vault set into rock | MIDAS, Ledger Warden |
| Radar Bay | Smooth spherical chamber on a stepped mound | HEIMDALL, Watch Officer |
| The Archives | Long low library with warm lit windows | CHRONICLE, Archivist |

Each room carries a status of `live`, `partial` or `offline`. Offline rooms
render dimmed, in the hub and in their interior, and are never hidden.

## Where the data lives

Everything the interface reads sits in two modules, both shaped to be swapped
for a `fetch` later without touching a component:

- `src/data/rooms.ts` — one typed `Room[]`, plus the left-to-right `TAB_ORDER`
  derived from the hotspot geometry.
- `src/data/images.ts` — `HUB_IMAGE` and the `ROOM_IMAGES` path map.

Hotspot rectangles and sprite anchors are percentages of the image, so they hold
at any viewport size.

## The art

The nine images (one hub, eight interiors) are generated as layered painterly
SVG by `scripts/generate-art.mjs` into `public/art/`, using the shared palette,
lighting and haze helpers in `scripts/art-lib.mjs`. `npm run art` regenerates
them; the output is deterministic, so re-running never churns the diff.

To drop in different art, write the new files over `public/art/` or repoint
`src/data/images.ts`. Nothing else needs to change — the hotspots are anchored
to the same percentage geometry, laid out to match the hub composition.

No text is baked into any image.

## Agent sprites

Animated agent sprites are a second pass and are deliberately not part of the
art. The anchor points are already in the data and already rendered as empty,
non-interactive markers:

- `room.hubAnchor` — one per structure on the hub, rendered inside `.sprites`.
- `room.interiorAnchors` — one or more per interior.

Each marker carries `data-anchor`, `data-room` and `data-scale`, so the sprite
layer can attach to them without new geometry.

## Motion

Two things move on their own and nothing else: a slow parallax drift on the hub
image (under 2%, 40s, alternating) and an uneven lantern flicker over the lit
structures. Both stop under `prefers-reduced-motion: reduce`, which also
collapses the cross-fade and the panel entrance.

The middle icon button in the top right stills the same ambient motion by hand.
The first outlines every structure for a couple of seconds; the third fills the
screen. None of them opens a screen.

## Accessibility

Hotspots are real buttons in left-to-right tab order with visible focus rings
and full labels (room, agent, role, status, last run). Stepping into a room
moves focus to the back control; leaving it puts focus back on the structure you
came from. The hub is inert while a room is open.
