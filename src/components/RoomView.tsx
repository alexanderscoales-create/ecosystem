import { useEffect, useRef } from 'react';
import { ROOM_IMAGES } from '../data/images';
import type { Room } from '../types';
import RoomPanel from './RoomPanel';

interface Props {
  room: Room;
  /** False on mount and again on the way out, so CSS can cross-fade both ways. */
  entered: boolean;
  onBack: () => void;
}

export default function RoomView({ room, entered, onBack }: Props) {
  const backRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    backRef.current?.focus();
  }, [room.id]);

  return (
    <section
      className={`room room--${room.status}${entered ? ' is-entered' : ''}`}
      aria-label={`${room.name} interior`}
    >
      <img className="room__image" src={ROOM_IMAGES[room.id]} alt="" draggable={false} />

      {/* Anchor points for the animated agent sprites of the second pass. */}
      <div className="sprites" aria-hidden="true">
        {room.interiorAnchors.map((anchor) => (
          <span
            key={anchor.id}
            className="sprite-anchor"
            data-anchor={anchor.id}
            data-room={room.id}
            data-scale={anchor.scale}
            style={{ left: `${anchor.x}%`, top: `${anchor.y}%` }}
          />
        ))}
      </div>

      <button ref={backRef} type="button" className="room__back" onClick={onBack}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M14.5 5.5 8 12l6.5 6.5" />
        </svg>
        Habitat
        <kbd>Esc</kbd>
      </button>

      <RoomPanel room={room} />
    </section>
  );
}
