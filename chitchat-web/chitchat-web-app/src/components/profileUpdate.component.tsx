import ProfileUpdatePage from './register/profile/ProfileUpdatePage';
import { Profile } from '../state/pk-system-state';
import AuthenticatedLayout from '../app/AuthenticatedLayout';

const ProfileUpdate = ({
  user_id,
  profile,
}: {
  user_id: string;
  profile: Profile;
}) => {
  const { birthday, phoneNumber, username, gender } = profile;

  return (
    <AuthenticatedLayout>
      <ProfileUpdatePage
        user_id={user_id}
        birthday={birthday}
        phoneNumber={phoneNumber}
        username={username}
        gender={gender}
      />
    </AuthenticatedLayout>
  );
};

export default ProfileUpdate;
