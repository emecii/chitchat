// ChatSideBar.tsx

import React from 'react';
import { Model } from '../../types/Model';

interface ModelListProps {
  models: Model[];
  onUserClick: (model: Model) => void;
}

export const ModelList: React.FC<ModelListProps> = ({ models, onUserClick }) => {
  return (
    <div className="model-list">
      {models.map((model, index) => (
        <div
          key={index}
          className="model-avatar"
          onClick={() => onUserClick(model)}
        >
          <img src={model.model_metadata.image_url || 'default_avatar_image_url'} alt={model.model_name} />
        </div>
      ))}
    </div>
  );
};
