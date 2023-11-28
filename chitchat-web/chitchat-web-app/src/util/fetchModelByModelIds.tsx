import axios from 'axios';
import { DEFAULT_AVATAR_URL } from '../types/DefaultAvatarUrl';
import { ENDPOINT } from '../types/Env';
import { HttpStatus } from '../types/HttpStatus';
import { Model } from '../types/Model';
import { ModelAvatar } from '../types/ModelAvatar';

export const fetchModelSrcByModelId = async (modelId: string) => {
  // Fetch modelName and modelSrc from backend
  return await axios
    .get(`${ENDPOINT}/api/model-profile`, {
      params: {
        model_id: modelId,
      },
    })
    .then((response) => {
      if (response.status === HttpStatus.OK) {
        const curModelArray = response.data.data as Model[];
        return curModelArray[0].model_metadata.image_url;
      } else {
        return DEFAULT_AVATAR_URL;
      }
    })
    .catch((err) => {
      console.log("fetchModelSrcByModelId Error", err)
      return DEFAULT_AVATAR_URL;
    });
};

export const fetchModelSrcsByModelIds = async (
  modelIds: string[],
): Promise<ModelAvatar[]> => {
  try {
    const promises = modelIds.map(async (modelId) => {
      const avatarSrc = await fetchModelSrcByModelId(modelId);
      return { modelId, avatarSrc };
    });

    const modelAvatars = await Promise.all(promises);
    //console.log("fetchModelSrcsByModelIds - modelAvatars", modelAvatars);

    return modelAvatars;
  } catch (err) {
    console.log('fetchModelSrcsByModelIds Error', err);
    // Return an array of default avatars in case of error
    return modelIds.map((modelId) => ({
      modelId,
      avatarSrc: DEFAULT_AVATAR_URL,
    }));
  }
};
