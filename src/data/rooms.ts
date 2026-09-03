import type { Room, RoomId } from '../types';

/**
 * Every room in the ARES habitat, in one typed array.
 *
 * Hotspot rectangles and sprite anchors are percentages of the hub image, so
 * they survive any viewport size. Swap this constant for a fetch later; nothing
 * downstream reads anything but `ROOMS` and `roomById`.
 */
export const ROOMS: Room[] = [
  {
    id: 'bridge',
    name: 'The Bridge',
    structure: 'Penthouse of the central tower',
    agent: {
      name: 'JARVIS',
      role: 'Orchestrator',
      personality: 'Unhurried and dry. Answers the question you should have asked.',
    },
    purpose:
      'Reads the state of every other room, decides what runs next, and holds the standing plan for the habitat.',
    status: 'live',
    lastRun: '4 minutes ago',
    handsOffTo: ['commerce-lab', 'content-engine', 'research-lab', 'radar-bay'],
    hotspot: { x: 43.5, y: 8.5, w: 13, h: 17 },
    hubAnchor: { id: 'bridge-sentinel', x: 50, y: 24.5, scale: 0.5 },
    interiorAnchors: [
      { id: 'bridge-table', x: 50, y: 63, scale: 1 },
      { id: 'bridge-window', x: 79, y: 55, scale: 0.8 },
    ],
  },
  {
    id: 'commerce-lab',
    name: 'Commerce Lab',
    structure: 'Open fabrication hall at the tower base',
    agent: {
      name: 'FRIDAY',
      role: 'Commerce Fabricator',
      personality: 'Brisk, faintly amused, allergic to a half-finished spec.',
    },
    purpose:
      'Turns an approved offer into a finished, priced, printable product and pushes it down the belt.',
    status: 'live',
    lastRun: '11 minutes ago',
    handsOffTo: ['media-bay', 'treasury'],
    hotspot: { x: 41, y: 60, w: 18, h: 19 },
    hubAnchor: { id: 'commerce-floor', x: 50, y: 76, scale: 0.62 },
    interiorAnchors: [
      { id: 'commerce-press', x: 34, y: 60, scale: 1 },
      { id: 'commerce-belt', x: 66, y: 72, scale: 0.85 },
    ],
  },
  {
    id: 'content-engine',
    name: 'Content Engine',
    structure: 'Half-buried hangar',
    agent: {
      name: 'KAREN',
      role: 'Replication Lead',
      personality: 'Patient, literal, quietly proud of a clean run of a thousand.',
    },
    purpose:
      'Takes one approved master and multiplies it into every variant the habitat needs, on gantry after gantry.',
    status: 'live',
    lastRun: '27 minutes ago',
    handsOffTo: ['media-bay', 'archives'],
    hotspot: { x: 5.5, y: 50, w: 19, h: 20 },
    hubAnchor: { id: 'hangar-mouth', x: 15, y: 67, scale: 0.55 },
    interiorAnchors: [
      { id: 'engine-master', x: 50, y: 58, scale: 1 },
      { id: 'engine-gantry', x: 22, y: 68, scale: 0.7 },
    ],
  },
  {
    id: 'media-bay',
    name: 'Media Bay',
    structure: 'Printing house with tall arched windows',
    agent: {
      name: 'EDITH',
      role: 'Media Compositor',
      personality: 'Fussy about margins. Will re-set a page rather than explain it.',
    },
    purpose:
      'Sets copy, art and proofs into the finished piece, then pulls a physical proof before anything ships.',
    status: 'partial',
    lastRun: '1 hour ago',
    handsOffTo: ['archives'],
    hotspot: { x: 11.5, y: 28.5, w: 18, h: 18.5 },
    hubAnchor: { id: 'press-door', x: 20.5, y: 45, scale: 0.5 },
    interiorAnchors: [
      { id: 'media-press', x: 68, y: 62, scale: 1 },
      { id: 'media-proofs', x: 27, y: 46, scale: 0.75 },
    ],
  },
  {
    id: 'research-lab',
    name: 'Research Lab',
    structure: 'Vine-wrapped glass observation dome',
    agent: {
      name: 'CEREBRA',
      role: 'Signal Analyst',
      personality: 'Curious to a fault. Will happily follow an anomaly past its usefulness.',
    },
    purpose:
      'Watches the long instruments, runs the slow experiments, and files what holds up as a finding.',
    status: 'live',
    lastRun: '9 minutes ago',
    handsOffTo: ['bridge', 'archives'],
    hotspot: { x: 67, y: 27, w: 18, h: 20 },
    hubAnchor: { id: 'dome-apex', x: 76, y: 44, scale: 0.5 },
    interiorAnchors: [
      { id: 'lab-scope', x: 38, y: 55, scale: 1 },
      { id: 'lab-gauges', x: 74, y: 60, scale: 0.8 },
    ],
  },
  {
    id: 'treasury',
    name: 'Treasury',
    structure: 'Gold-doored vault set into rock',
    agent: {
      name: 'MIDAS',
      role: 'Ledger Warden',
      personality: 'Formal, immovable, and slower than you would like on purpose.',
    },
    purpose:
      'Weighs every claim against the ledger and releases funds only once both sides balance.',
    status: 'partial',
    lastRun: '3 hours ago',
    handsOffTo: ['bridge'],
    hotspot: { x: 81, y: 50.5, w: 15, h: 18 },
    hubAnchor: { id: 'vault-step', x: 88, y: 66, scale: 0.5 },
    interiorAnchors: [
      { id: 'vault-scale', x: 50, y: 57, scale: 1 },
      { id: 'vault-trays', x: 24, y: 70, scale: 0.7 },
    ],
  },
  {
    id: 'radar-bay',
    name: 'Radar Bay',
    structure: 'Smooth spherical chamber on a stepped mound',
    agent: {
      name: 'HEIMDALL',
      role: 'Watch Officer',
      personality: 'Says almost nothing, then says the one thing that matters.',
    },
    purpose:
      'Holds the whole outside world on the curved wall and raises the alarm before anyone else notices.',
    status: 'live',
    lastRun: '1 minute ago',
    handsOffTo: ['bridge', 'research-lab'],
    hotspot: { x: 61, y: 66.5, w: 17, h: 20 },
    hubAnchor: { id: 'sphere-walk', x: 69.5, y: 84, scale: 0.55 },
    interiorAnchors: [
      { id: 'radar-chair', x: 50, y: 66, scale: 1 },
      { id: 'radar-walkway', x: 72, y: 74, scale: 0.7 },
    ],
  },
  {
    id: 'archives',
    name: 'The Archives',
    structure: 'Long low library with warm lit windows',
    agent: {
      name: 'CHRONICLE',
      role: 'Archivist',
      personality: 'Gentle, exact, and unwilling to let a thing go unrecorded.',
    },
    purpose:
      'Keeps the record of everything the habitat has made, chained to the desk and indexed by hand.',
    status: 'offline',
    lastRun: '2 days ago',
    handsOffTo: [],
    hotspot: { x: 13.5, y: 73, w: 21, h: 17 },
    hubAnchor: { id: 'library-lamp', x: 24, y: 87, scale: 0.5 },
    interiorAnchors: [
      { id: 'archive-desk', x: 42, y: 68, scale: 1 },
      { id: 'archive-lantern', x: 66, y: 40, scale: 0.6 },
    ],
  },
];

/** Left-to-right (then top-to-bottom) reading order, used for tab order. */
export const TAB_ORDER: RoomId[] = [...ROOMS]
  .sort((a, b) => {
    const ax = a.hotspot.x + a.hotspot.w / 2;
    const bx = b.hotspot.x + b.hotspot.w / 2;
    return ax === bx ? a.hotspot.y - b.hotspot.y : ax - bx;
  })
  .map((room) => room.id);

const byId = new Map<RoomId, Room>(ROOMS.map((room) => [room.id, room]));

export function roomById(id: RoomId): Room {
  const room = byId.get(id);
  if (!room) throw new Error(`Unknown room: ${id}`);
  return room;
}

export const STATUS_LABEL: Record<Room['status'], string> = {
  live: 'Live',
  partial: 'Partial',
  offline: 'Offline',
};
