import type { RoomId } from '../types';

/**
 * Every image path the interface uses, in one place. Point these at generated
 * art, a CDN, or a fetched manifest without touching a component.
 */
export const HUB_IMAGE = '/art/hub.svg';

export const ROOM_IMAGES: Record<RoomId, string> = {
  bridge: '/art/bridge.svg',
  'commerce-lab': '/art/commerce-lab.svg',
  'content-engine': '/art/content-engine.svg',
  'media-bay': '/art/media-bay.svg',
  'research-lab': '/art/research-lab.svg',
  treasury: '/art/treasury.svg',
  'radar-bay': '/art/radar-bay.svg',
  archives: '/art/archives.svg',
};
