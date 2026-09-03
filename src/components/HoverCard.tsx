import { useLayoutEffect, useRef, useState } from 'react';
import type { Room } from '../types';
import { STATUS_LABEL } from '../data/rooms';

interface Props {
  room: Room;
  x: number;
  y: number;
}

const GAP = 18;
const EDGE = 14;

/** Small label card that follows the cursor over a structure. */
export default function HoverCard({ room, x, y }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: x + GAP, top: y + GAP });

  useLayoutEffect(() => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    const left = Math.min(Math.max(EDGE, x + GAP), window.innerWidth - box.width - EDGE);
    const top = Math.min(Math.max(EDGE, y + GAP), window.innerHeight - box.height - EDGE);
    setPos({ left, top });
  }, [x, y, room.id]);

  return (
    <div ref={ref} className="hovercard" style={{ left: pos.left, top: pos.top }} role="presentation">
      <p className="hovercard__room">{room.name}</p>
      <p className="hovercard__agent">
        <span className="hovercard__name">{room.agent.name}</span>
        <span className="hovercard__role">{room.agent.role}</span>
      </p>
      <p className={`hovercard__meta hovercard__meta--${room.status}`}>
        <span className="dot" aria-hidden="true" />
        {STATUS_LABEL[room.status]} · last run {room.lastRun}
      </p>
    </div>
  );
}
