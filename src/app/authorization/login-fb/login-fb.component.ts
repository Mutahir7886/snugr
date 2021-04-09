import {Component, OnInit} from '@angular/core';
import {Facebook} from "@ionic-native/facebook/ngx";
import {Uid} from "@ionic-native/uid/ngx";
import {AndroidPermissions} from "@ionic-native/android-permissions/ngx";
import {Device} from "@ionic-native/device/ngx";
import {NavController} from "@ionic/angular";
import {Router} from "@angular/router";
import {apiUrls} from "../../../environments/apis/api.urls";
import {HttpService} from "../../../shared/services/http.service";
import {FirebaseX} from '@ionic-native/firebase-x/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Component({
    selector: 'app-login-fb',
    templateUrl: './login-fb.component.html',
    styleUrls: ['./login-fb.component.scss'],
})
export class LoginFbComponent implements OnInit {
    user_login: any = {};
    UserImage: any;
    userFriends:any =[];
    loader=false
    private gotUserImage: boolean = false;
    notificationToken;
     deviceID: any;


    constructor(private fb: Facebook,
                private uid: Uid,
                private androidPermissions: AndroidPermissions,
                private device: Device,
                private router: Router,
                private httpService:HttpService,
                private firebaseX: FirebaseX,
                private googlePlus: GooglePlus,
                private navCtrl: NavController) {

        this.deviceID=this.device.uuid
    }

    ngOnInit() {
    }

    login() {
        console.log('234')
        this.facebookLogin()

    }

    async facebookLogin() {

        this.fb.login(['public_profile', 'email', 'user_friends'])
            .then(res => {
                this.loader=true
                this.fb.api('/' + res.authResponse.userID + '/?fields=id,email,name', [])
                    .then(userCredentials => {
                        this.fb.api('/' + res.authResponse.userID + '/?fields=picture.width(200).height(200)', [])
                            .then(userPicture => {
                                this.fb.api('/' + res.authResponse.userID + '/friends', [])
                                    .then(async (userFriends) => {
                                        console.log(userFriends)
                                        userFriends.data.forEach(value=>{
                                            this.userFriends.push(value.id)
                                        })
                                        console.log('userfirends',this.userFriends)
                                        await this.firebaseX.getToken()
                                            .then(token => {
                                                this.notificationToken=token
                                                console.log(`The token is ${token}`)
                                            }) // save the token server-side and use it to push notifications to this device
                                            .catch(error => console.error('Error getting token', error));

                                        this.httpService.post(apiUrls.signUp, {
                                            fb_id:userCredentials.id,
                                            name: userCredentials.name,
                                            email: userCredentials.email,
                                            profileType: 0,
                                            profile:userPicture.picture.data.url,
                                            device_token:this.device.uuid,
                                            notification_token:this.notificationToken,
                                            friends:this.userFriends
                                        }).subscribe(data => {
                                            this.loader=false
                                            if(data.device){
                                                // redirect to homepage
                                                console.log('login with fb already profile set')
                                                localStorage.setItem('userData', JSON.stringify(data.user))
                                                localStorage.setItem('profileToken', JSON.stringify(data.device.auth_token))
                                                localStorage.setItem('deviceInfo', JSON.stringify(data.device.push_nots))
                                                localStorage.setItem('userFriends', JSON.stringify(data.user.friends))
                                                localStorage.setItem('userCredentialS', res.authResponse.userID)

                                                // this.router.navigate(['alltabs/tabs/tab2']);
                                                this.navCtrl.navigateRoot('alltabs/tabs/tab2')
                                                console.log('already present user',data)
                                            }
                                            else {
                                                // redirect to profile-setup
                                                console.log('login with fb  profile not set')
                                                console.log(data)
                                                localStorage.setItem('userData', JSON.stringify(data))
                                                // localStorage.setItem('userFriends', JSON.stringify(data.friends))
                                                // localStorage.setItem('userCredentialS', res.authResponse.userID)
                                                // this.router.navigate(['/loginPage']);
                                                this.navCtrl.navigateRoot('/loginPage')
                                                console.log(data)
                                            }
                                        }, error => {
                                            this.loader=false
                                            this.userFriends=[]
                                            console.log('a', error)

                                        });
                                    })
                                    .catch(e => {
                                        console.log(e, 'error');
                                    });

                            })
                            .catch(e => {
                                console.log(e, 'error');
                            });
                    })
                    .catch(e => {
                        console.log(e, 'error');
                    });
            })
            .catch(e => {
                console.log('Error logging into Facebook', e)
            });

    }

    getUserDetailFromFB(userid: any) {
        this.fb.api('/' + userid + '/?fields=id,email,name', [])
            .then(res => {
                console.log(res, 'public_profile');
                // this.user_login.email=res.email;
                // this.user_login.id=res.id;
                // this.user_login.name=res.name;
                // console.log(this.user_login, 'user_login');
                let name = res.name.split(' ');
            })
            .catch(e => {
                console.log(e, 'error');
            });
    }

    getUserProfilePicFB(userid: any) {
        this.fb.api('/' + userid + '/?fields=picture.width(200).height(200)', [])
            .then(res => {
                console.log(res, 'user_picture');
                this.UserImage = res.picture.data.url;
                console.log(this.UserImage, 'user_picture');

                // this.user_login.picture_url=res.picture.data.url;
                // console.log(this.user_login, 'user_login');

            })
            .catch(e => {
                console.log(e, 'error');
            });
    }

    getFriends(userid: any) {
        this.fb.api('/' + userid + '/friends', [])
            .then(res => {
                console.log(res, 'friends of this user');
            })
            .catch(e => {
                console.log(e, 'error');
            });
    }

    loginwithGmail() {
        console.log('gmail')
        this.googlePlus.login({
            // 'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
            'webClientId': '809110423923-g50h0u00h8oc6em367r3gktr31jt54p6.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
            'offline': false // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
        })
            .then(async (gmailResponse) => {
                await this.firebaseX.getToken()
                    .then(token => {
                        this.notificationToken=token
                        console.log(`The token is ${token}`)
                    })
                    .catch(error => console.error('Error getting token', error));
                console.log('gmail api response',gmailResponse)
                this.httpService.post(apiUrls.signUp, {
                    gmail_id:gmailResponse.userId,
                    name: gmailResponse.displayName,
                    email: gmailResponse.email,
                    profileType: 1,
                    profile:gmailResponse.imageUrl,
                    device_token:this.device.uuid,
                    notification_token:this.notificationToken,
                    friends:[]
                }).subscribe(data => {
                    console.log('gmail backend api response',data)
                    if(data.device){
                        // redirect to homepage
                        console.log('login with gmail profile set')
                        localStorage.setItem('userData', JSON.stringify(data.user))
                        localStorage.setItem('profileToken', JSON.stringify(data.device.auth_token))
                        localStorage.setItem('deviceInfo', JSON.stringify(data.device.push_nots))
                        localStorage.setItem('userFriends', JSON.stringify(data.user.friends))
                        localStorage.setItem('userCredentialS', JSON.stringify(data.user))

                        // this.router.navigate(['alltabs/tabs/tab2']);
                        this.navCtrl.navigateRoot('alltabs/tabs/tab2')

                        console.log('already present user',data)
                    }
                    else {
                        // redirect to profile-setup
                        console.log('login with gmail profile not set')
                        console.log(data)
                        localStorage.setItem('userData', JSON.stringify(data))
                        // localStorage.setItem('userFriends', JSON.stringify(data.friends))
                        // localStorage.setItem('userCredentialS', JSON.stringify(data))
                        // this.router.navigate(['/loginPage']);
                        this.navCtrl.navigateRoot('/loginPage')

                        console.log(data)
                    }
                }, error => {
                    this.loader=false
                    this.userFriends=[]
                    console.log('a', error)

                });

                    // this.httpService.post(apiUrls.signUp,{}).subscribe(data=>{
                //
                // },error =>{
                //
                // });
            })
            .catch(err => console.error('error',err));
    }

    // logout() {
    //     this.googlePlus.logout()
    // }
}
