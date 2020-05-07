import { IActivity } from './../models/activity';
import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import agent from '../../api/agent';

configure({ enforceActions: 'always' });

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable activity: IActivity | null = null;
    @observable loadingInitial = false;
    @observable submitting = false;
    @observable target = '';

    @computed get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    }

    groupActivitiesByDate(activities: IActivity[]){
        const sortedActivities = activities.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
        return Object.entries(sortedActivities.reduce((activities /* Previous value */, activity /* current value */)=>{
            const date = activity.date.split('T')[0];

            activities[date] = activities[date] ? [...activities[date], activity] :  [activity];
            return activities;

        }, {} as {[key:string] : IActivity[] }));
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.get();
            runInAction('loading activities ', () => {
                activities.forEach((activity: IActivity) => {
                    activity.date = activity.date.split(".")[0];
                    this.activityRegistry.set(activity.id, activity);
                });
                this.loadingInitial = false;
            });
        } catch (error) {
            console.log(error);
            runInAction('loading activities error', () => {
                this.loadingInitial = false;
            });
        }
    }

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);

        if (activity) {
            this.activity = activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction('getting activity', () => {
                    this.activity = activity;
                    this.loadingInitial = false;
                })
            } catch (error) {
                console.log(error);
                runInAction('get activity error', () => {
                    this.loadingInitial = false;
                });
            }
        }
    }

    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    @action clearActivity = () => {
        this.activity = null;
    }

    @action createActivity = async (activity: IActivity) => {
        try {
            this.submitting = true;
            await agent.Activities.create(activity);

            runInAction(() => {
                this.submitting = false;
                this.activityRegistry.set(activity.id, activity);
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.submitting = false;
            });
        }
    }

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {

            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
                this.submitting = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.submitting = false;
            });
        }
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);

            runInAction(() => {
                this.activityRegistry.delete(id);
                this.submitting = false;
                this.target = '';
            });

        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.submitting = false;
                this.target = '';
            });
        }
    }
}

export default createContext(new ActivityStore());