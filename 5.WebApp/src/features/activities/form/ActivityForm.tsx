import React, { useState, FormEvent, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteChildrenProps } from "react-router-dom";

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteChildrenProps<DetailParams>> = ({
  match,
  history
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    createActivity,
    editActivity,
    submitting,
    activity: initalFormState,
    loadActivity,
    clearActivity
  } = activityStore;

  const [activity, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: "",
  });

  useEffect(() => {
    if(match?.params.id && activity.id.length === 0){
      loadActivity(match.params.id).then(() => initalFormState && setActivity(initalFormState));
    }

    return () =>{
      clearActivity();
    }
  },[loadActivity, clearActivity, match?.params.id, initalFormState, activity.id.length]);

  const handleSumbit = () => {
    if (activity.id.length === 0) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity).then(()=>{
        history.push(`/activities/${newActivity.id}`)
      });
    } else {
      editActivity(activity).then(()=>{
        history.push(`/activities/${activity.id}`)
      });
    }
  };

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  return (
<Grid>
  <Grid.Column width={10}>
  <Segment clearing>
      <Form onSubmit={handleSumbit}>
        <Form.Input
          placeholder="Title"
          value={activity.title}
          name="title"
          onChange={handleInputChange}
        />
        <Form.TextArea
          rows={2}
          placeholder="Description"
          value={activity.description}
          name="description"
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder="Category"
          value={activity.category}
          name="category"
          onChange={handleInputChange}
        />
        <Form.Input
          type="datetime-local"
          placeholder="Date"
          value={activity.date}
          name="date"
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder="City"
          value={activity.city}
          name="city"
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder="Venue"
          value={activity.venue}
          name="venue"
          onChange={handleInputChange}
        />
        <Button
          floated="right"
          positive
          type="submit"
          content="Submit"
          loading={submitting}
        />
        <Button
          onClick={() => history.push('/activities')}
          floated="right"
          type="submit"
          content="Cancel"
        />
      </Form>
    </Segment>
  </Grid.Column>
</Grid>


  );
};

export default observer(ActivityForm);
