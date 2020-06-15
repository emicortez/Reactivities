import React, { useContext, useState } from "react";
import { Tab, Grid, Header, Card, Button } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../app/stores/rootStore";
import ProfileEditForm from "./ProfileEditForm";
import { IProfile } from "../../app/models/profile";

const ProfileDescription = () => {
  const rootStore = useContext(RootStoreContext);
  const { profile, isCurrentUser, update } = rootStore.profileStore;
  const [editProfileMode, setEditProfileMode] = useState(false);

  const handleUpdateProfile = (profile : IProfile) => {
      update(profile).then(() => setEditProfileMode(false));
  }

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header
            floated="left"
            icon="user"
            content={`About ${profile?.displayName}`}
          />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={editProfileMode ? "Cancel" : "Edit Profile"}
              onClick={() => setEditProfileMode(!editProfileMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {editProfileMode ? (
            <ProfileEditForm profile={profile!} update={handleUpdateProfile} />
          ) : (
            <Card.Content>{profile?.bio}</Card.Content>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileDescription);
