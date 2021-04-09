import {environment} from "../environment";

export const apiUrls = {

    signUp: environment.baseUrl + '/api/users',
    profileSetup: environment.baseUrl + '/api/users/',
    searchUser: environment.baseUrl + '/api/users/',
    userFriends: environment.baseUrl + '/api/friends/',
    addFriends: environment.baseUrl + '/api/friends/',
    Groups: environment.baseUrl + '/api/groups/',
    Bulb: environment.baseUrl + '/api/groups/bulb/',
    notification:environment.baseUrl + '/api/notifications/',


}
