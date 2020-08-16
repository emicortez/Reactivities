import { history } from './../../index';
import { IUser, IUserFormValues } from './../models/user';
import { observable, computed, action, runInAction } from 'mobx';
import agent from '../../api/agent';
import { RootStore } from './rootStore';

export default class UserStore {

    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @observable user: IUser | null = null;
    @observable loading = false;

    @computed get isLoggedIn() { return !!this.user; }

    @action login = async (values: IUserFormValues) => {
        try {
            const user = await agent.User.login(values);

            runInAction(() => {
                this.user = user;
            });
            this.rootStore.commonStore.setToken(user.token);
            this.rootStore.modalStore.closeModal();
            history.push('/activities')
        }
        catch (error) {
            throw error;
        }
    }



    @action loguout = () =>{
        this.rootStore.commonStore.setToken(null);
        this.user = null;
        history.push('/');
    }

    @action fbLogin = async(response:any) => {
        this.loading = true;
        
        try{
            const user = await agent.User.fbLogin(response.accessToken);
            runInAction(() => {
                this.user = user;
                this.rootStore.commonStore.setToken(user.token);
                this.rootStore.modalStore.closeModal();
                this.loading = false;
            });

            history.push('/activities');
        }catch(error){
            this.loading = false;
            throw error;
        }
    }

    @action getUser = async() => {
        try{
            const user = await agent.User.current();
            runInAction(() => {
                this.user = user;
            })
        }catch(error)
        {
            console.log(error);
        }
    }

    @action register = async (values:IUserFormValues) => {
        try {
            const user = await agent.User.register(values);

            runInAction(() => {
                this.user = user;
            });
            this.rootStore.commonStore.setToken(user.token);
            this.rootStore.modalStore.closeModal();
            history.push('/activities');
        }
        catch (error) {
            throw error;
        }
    }
}