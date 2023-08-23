import { IMessage } from '../types/IMessage';
import GenderType from '../types/GenderType';
import { Model } from '../types/Model';
import UserRole from '../types/UserRole';
import { DEFAULT_AVATAR_URL } from '../types/DefaultAvatarUrl';

export const pkSystemState: PkSystemState = {
  isFlippedCardOne: false,
  curImageId: 0,
  messageList: [] as IMessage[],
  user: {
    id: 'unknown',
    role: UserRole.GUEST, // default guest
    profile: {
      username: '',
      birthday: new Date(),
      gender: GenderType.UNKNOWN,
      phoneNumber: '',
      avatar: DEFAULT_AVATAR_URL,
      mbtiType: '',
      selectedTags: [],
    },
  },
  modelArrays: [] as Model[],
  curModelName: 'AI角色',
  curModelSrc: '',
  curModelIdString: '',
  modalOpen: false,
  isLoggedIn: false,
};

export type PkSystemState = {
  isFlippedCardOne: boolean | undefined;
  curImageId: number;
  messageList: IMessage[];
  user: AppUser;
  modelArrays: Model[];
  curModelName: string;
  curModelSrc: string;
  modalOpen: boolean;
  curModelIdString: string;
  isLoggedIn: boolean;
};

export type Profile = {
  username: string;
  birthday: Date;
  gender: GenderType;
  phoneNumber: string;
  avatar: string;
  mbtiType: string;
  selectedTags: string[];
};

export type AppUser = {
  id: string;
  role: UserRole;
  profile: Profile;
};
