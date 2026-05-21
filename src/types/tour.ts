export type TourNode = {
  id: string;
  name: string;
  category: string;
  description: string;
  panoramaUrl: string;
  thumbnailUrl?: string;
  defaultYaw?: number;
  defaultPitch?: number;
  mapPosition?: {
    x: number;
    y: number;
    shape?: 'circle' | 'square' | 'triangle' | 'diamond';
    color?: string;
  };
  mapId?: string;
  facilities?: string[];
  navigationHotspots: NavigationHotspot[];
  infoHotspots: InfoHotspot[];
};

export type NavigationHotspot = {
  id: string;
  targetNodeId: string;
  label: string;
  yaw: number;
  pitch: number;
};

export type InfoHotspot = {
  id: string;
  label: string;
  description: string;
  yaw: number;
  pitch: number;
};
