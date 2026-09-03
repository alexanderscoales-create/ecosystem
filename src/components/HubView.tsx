import { useCallback, useEffect, useRef, useState } from 'react';
import { HUB_IMAGE } from '../data/images';
import { ROOMS, TAB_ORDER, roomById } from '../data/rooms';
import type { RoomId } from '../types';
import HoverCard from './HoverCard';

interface Props {
  onSelect: (id: RoomId) => void;
  /** Slow drift and lantern flicker; off for reduced motion. */
  ambient: boolean;
  /** Briefly outlines every structure. */
  revealed: boolean;
  /** True while a room is open: the hub is scenery, not a control surface. */
  dimmed: boolean;
  /** Hotspot to restore focus to once a room closes. */
  focusRoom: RoomId | null;
}

interface Pointer {
  id: RoomId;
  x: number;
  y: number;
}

export default function HubView({ onSelect, ambient, revealed, dimmed, focusRoom }: Props) {
  const [pointer, setPointer] = useState<Pointer | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  // Coming back from a room puts focus back on the structure you stepped into.
  useEffect(() => {
    if (dimmed || !focusRoom) return;
    frameRef.current
      ?.querySelector<HTMLButtonElement>(`button.hotspot[data-room="${focusRoom}"]`)
      ?.focus();
  }, [dimmed, focusRoom]);

  useEffect(() => {
    if (dimmed) setPointer(null);
  }, [dimmed]);

  const track = useCallback((id: RoomId, event: React.PointerEvent | React.MouseEvent) => {
    setPointer({ id, x: event.clientX, y: event.clientY });
  }, []);

  const trackFromElement = useCallback((id: RoomId, element: HTMLElement) => {
    const box = element.getBoundingClientRect();
    setPointer({ id, x: box.left + box.width / 2, y: box.top + box.height * 0.75 });
  }, []);

  return (
    <div
      ref={frameRef}
      className={[
        'hub',
        ambient ? 'hub--ambient' : '',
        revealed ? 'hub--revealed' : '',
        dimmed ? 'hub--dimmed' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden={dimmed || undefined}
      {...(dimmed ? { inert: '' } : {})}
    >
      <div className="hub__plate">
        <img className="hub__image" src={HUB_IMAGE} alt="" draggable={false} />
        <div className="hub__flicker" aria-hidden="true" />
      </div>

      <div className="hub__hotspots">
        {TAB_ORDER.map((id) => {
          const room = roomById(id);
          const { x, y, w, h } = room.hotspot;
          const active = pointer?.id === id;
          return (
            <button
              key={id}
              type="button"
              data-room={id}
              className={`hotspot hotspot--${room.status}${active ? ' is-active' : ''}`}
              style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
              aria-label={
                `${room.name}. ${room.agent.name}, ${room.agent.role}. ` +
                `${room.status === 'offline' ? 'Offline' : room.status === 'partial' ? 'Partial' : 'Live'}. ` +
                `Last run ${room.lastRun}.`
              }
              onPointerMove={(event) => track(id, event)}
              onPointerEnter={(event) => track(id, event)}
              onPointerLeave={() => setPointer((p) => (p?.id === id ? null : p))}
              onFocus={(event) => trackFromElement(id, event.currentTarget)}
              onBlur={() => setPointer((p) => (p?.id === id ? null : p))}
              onClick={() => onSelect(id)}
            >
              <span className="hotspot__bloom" aria-hidden="true" />
              <span className="hotspot__ring" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      {/* Anchor points for the animated agent sprites of the second pass. */}
      <div className="sprites" aria-hidden="true">
        {ROOMS.map((room) => (
          <span
            key={room.hubAnchor.id}
            className="sprite-anchor"
            data-anchor={room.hubAnchor.id}
            data-room={room.id}
            data-scale={room.hubAnchor.scale}
            style={{ left: `${room.hubAnchor.x}%`, top: `${room.hubAnchor.y}%` }}
          />
        ))}
      </div>

      {pointer && !dimmed && (
        <HoverCard room={roomById(pointer.id)} x={pointer.x} y={pointer.y} />
      )}
    </div>
  );
}
