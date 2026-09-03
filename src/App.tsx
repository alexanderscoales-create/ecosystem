import { useCallback, useEffect, useRef, useState } from 'react';
import HubView from './components/HubView';
import RoomView from './components/RoomView';
import TopBar from './components/TopBar';
import { roomById } from './data/rooms';
import { useReducedMotion } from './hooks/useReducedMotion';
import type { RoomId } from './types';

/** Length of the hub/room cross-fade, matched in app.css. */
const CROSSFADE_MS = 620;

export default function App() {
  const reducedMotion = useReducedMotion();
  const [ambientOn, setAmbientOn] = useState(true);
  const [revealed, setRevealed] = useState(false);

  // `roomId` is the mounted room; `entered` drives the cross-fade class, so the
  // hub stays painted underneath for the whole transition in both directions.
  const [roomId, setRoomId] = useState<RoomId | null>(null);
  const [entered, setEntered] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const [lastRoom, setLastRoom] = useState<RoomId | null>(null);

  const ambient = ambientOn && !reducedMotion;
  const duration = reducedMotion ? 0 : CROSSFADE_MS;

  const openRoom = useCallback((id: RoomId) => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setLastRoom(id);
    setRoomId(id);
    requestAnimationFrame(() => setEntered(true));
  }, []);

  const closeRoom = useCallback(() => {
    setEntered(false);
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setRoomId(null);
      closeTimer.current = null;
    }, duration);
  }, [duration]);

  useEffect(() => () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
  }, []);

  // Escape always steps back out to the habitat.
  useEffect(() => {
    if (!roomId) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRoom();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [roomId, closeRoom]);

  // The reveal flash is a brief visual aid, never a persistent panel.
  useEffect(() => {
    if (!revealed) return undefined;
    const timer = window.setTimeout(() => setRevealed(false), 2600);
    return () => window.clearTimeout(timer);
  }, [revealed]);

  const inRoom = roomId !== null;

  return (
    <div className="app">
      <HubView
        onSelect={openRoom}
        ambient={ambient}
        revealed={revealed && !inRoom}
        dimmed={inRoom}
        focusRoom={lastRoom}
      />

      {roomId && (
        <RoomView
          room={roomById(roomId)}
          entered={entered}
          onBack={closeRoom}
        />
      )}

      <TopBar
        ambientOn={ambientOn}
        onToggleAmbient={() => setAmbientOn((on) => !on)}
        onReveal={() => setRevealed(true)}
        revealed={revealed}
      />
    </div>
  );
}
