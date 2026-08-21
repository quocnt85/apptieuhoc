import React from 'react';
import { PlanetCoordinateNode, PlanetData } from '../../types';
import { SpaceshipCockpitDashboard } from './SpaceshipCockpitDashboard';

interface Props {
  node: PlanetCoordinateNode;
  planet?: PlanetData;
  onStartLesson: (node: PlanetCoordinateNode) => void;
  onClose: () => void;
}

export const CoordinatePreviewModal: React.FC<Props> = (props) => {
  return <SpaceshipCockpitDashboard {...props} />;
};

