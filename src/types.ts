/** Operational state of a room. Offline rooms are dimmed, never hidden. */
export type RoomStatus = 'live' | 'partial' | 'offline';

/** Percentage-space rectangle over the hub image (0-100, origin top-left). */
export interface HotspotRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Percentage-space point over an image (0-100, origin top-left). */
export interface Anchor {
  id: string;
  x: number;
  y: number;
  /** Rough scale hint for the sprite that will be pinned here. */
  scale: number;
}

export interface Agent {
  name: string;
  role: string;
  personality: string;
}

export interface Room {
  id: RoomId;
  name: string;
  /** The structure in the hub diorama this room lives inside. */
  structure: string;
  agent: Agent;
  /** What the room does, in one sentence. */
  purpose: string;
  status: RoomStatus;
  /** Human-readable time of the agent's last run. */
  lastRun: string;
  /** Ids of the rooms this room hands finished work to. */
  handsOffTo: RoomId[];
  hotspot: HotspotRect;
  /** Where the animated agent sprite sits on the hub image. */
  hubAnchor: Anchor;
  /** Where animated sprites sit inside the room interior image. */
  interiorAnchors: Anchor[];
}

export type RoomId =
  | 'bridge'
  | 'commerce-lab'
  | 'content-engine'
  | 'media-bay'
  | 'research-lab'
  | 'treasury'
  | 'radar-bay'
  | 'archives';

export type View = { kind: 'hub' } | { kind: 'room'; roomId: RoomId };
