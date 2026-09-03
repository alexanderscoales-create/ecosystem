import { STATUS_LABEL, roomById } from '../data/rooms';
import type { Room } from '../types';

/** The one translucent panel in the room view, bottom left. */
export default function RoomPanel({ room }: { room: Room }) {
  return (
    <div className="panel">
      <p className="panel__room">{room.name}</p>
      <h1 className="panel__agent">{room.agent.name}</h1>
      <p className="panel__role">{room.agent.role}</p>

      <p className="panel__personality">{room.agent.personality}</p>
      <p className="panel__purpose">{room.purpose}</p>

      <dl className="panel__facts">
        <div className="panel__fact">
          <dt>Status</dt>
          <dd className={`panel__status panel__status--${room.status}`}>
            <span className="dot" aria-hidden="true" />
            {STATUS_LABEL[room.status]}
          </dd>
        </div>
        <div className="panel__fact">
          <dt>Last run</dt>
          <dd>{room.lastRun}</dd>
        </div>
        <div className="panel__fact panel__fact--wide">
          <dt>Hands off to</dt>
          <dd>
            {room.handsOffTo.length === 0
              ? 'Nothing downstream'
              : room.handsOffTo.map((id) => roomById(id).name).join(' · ')}
          </dd>
        </div>
      </dl>
    </div>
  );
}
