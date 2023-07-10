import Footer from "../app/Footer";
import styled from "styled-components";
import Navbar from "../app/Navbar";
import ProfileUpdatePage from "./register/profile/ProfileUpdatePage";
import { Profile } from "../state/pk-system-state";

const ProfileUpdatePageWrapper = styled.div`
  padding-top: 30px;
`;

const ProfileUpdate = ({ user_id, profile }: { user_id: string, profile: Profile }) => {
  const { birthday, phoneNumber, username, gender } = profile;

  return (
    <>
      <Navbar />
      <ProfileUpdatePageWrapper>
        <ProfileUpdatePage
          user_id={user_id}
          birthday={birthday}
          phoneNumber={phoneNumber}
          username={username}
          gender={gender}
        />
        <Footer />
      </ProfileUpdatePageWrapper>
    </>
  );
};

export default ProfileUpdate;
