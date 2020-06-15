import React from "react";
import { IProfile } from "../../app/models/profile";
import { Form as FinalForm, Field } from "react-final-form";
import { isRequired, combineValidators } from "revalidate";
import { Form, Button } from "semantic-ui-react";
import TextInput from "../../app/common/form/TextInput";
import TextAreaInput from "../../app/common/form/TextAreaInput";

const validate = combineValidators({
  displayName: isRequired({ message: "Name is required" }),
});

interface IProps {
  profile: IProfile;
  update: (profile: IProfile) => void;
}

const ProfileEditForm: React.FC<IProps> = ({ profile, update }) => {
  return (
    <FinalForm
      initialValues={profile!}
      validate={validate}
      onSubmit={update}
      render={({ handleSubmit, invalid, pristine, submitting }) => (
        <Form onSubmit={handleSubmit} error>
          <Field
            placeholder="Display Name"
            value={profile.displayName}
            name="displayName"
            component={TextInput}
          />
          <Field
            placeholder="Bio"
            value={profile.bio}
            name="bio"
            rows={3}
            component={TextAreaInput}
          />
          <Button
            floated="right"
            positive
            type="submit"
            content="Update profile"
            loading={submitting}
            disabled={invalid || pristine}
          />
        </Form>
      )}
    />
  );
};

export default ProfileEditForm;
