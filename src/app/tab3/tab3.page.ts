import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {apiUrls} from "../../environments/apis/api.urls";
import {HttpService} from "../../shared/services/http.service";
import {Device} from "@ionic-native/device/ngx";
import {GooglePlus} from "@ionic-native/google-plus/ngx";
import {Facebook} from "@ionic-native/facebook/ngx";
import {globalToast} from "../../shared/classes/globalToast";
import {FormControl} from "@angular/forms";
import {NavController} from "@ionic/angular";

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
    myId;
    notificationStatus;
    mylocalStorage;
    profileType;
    email;
    fb_id;
    messenger_id;
    phone;
    setPhoneNumber: string;
    setMessengerId:string;
    gmail_id;
    userFriends: any = [];
    notificationsControl: FormControl = new FormControl(JSON.parse(localStorage.getItem('deviceInfo')))


    // toggleCheck;

    constructor(private router: Router,
                private httpService: HttpService,
                private device: Device,
                private googlePlus: GooglePlus,
                private fb: Facebook,
                private globalToast: globalToast,
                private navCtrl: NavController) {

    }

    ngOnInit(): void {
        this.notificationsControl.valueChanges
            .subscribe((res: boolean) => {
               this.checkToggle(res)
            });
    }

    firstTimeChecked = false;

    ionViewWillEnter() {
        this.myId = JSON.parse(localStorage.getItem('userData'))._id;
        this.profileType = JSON.parse(localStorage.getItem('userData')).profileType
        this.email = JSON.parse(localStorage.getItem('userData')).email
        this.fb_id = JSON.parse(localStorage.getItem('userData')).fb_id
        this.gmail_id = JSON.parse(localStorage.getItem('userData')).gmail_id
        this.phone=JSON.parse(localStorage.getItem('userData')).phone
        this.messenger_id=JSON.parse(localStorage.getItem('userData')).messenger_id
        this.notificationStatus = JSON.parse(localStorage.getItem('deviceInfo'));

        console.log('this is the notification status, ', this.notificationStatus)
        console.log('this.profileType, ', this.profileType)


        // this.toggleCheck = JSON.parse(localStorage.getItem('deviceInfo'))
    }
    ionViewDidLeave() {


        this.setMessengerId='';
        this.setPhoneNumber='';
    }

    logout() {
        console.log('logout')
        this.httpService.post(apiUrls.profileSetup + this.myId + '/logout', {
            device_token: this.device.uuid,
        }).subscribe((data) => {
            if (JSON.parse(localStorage.getItem('userData')).gmail_id !== null) {
                console.log('LOGGED WITH GMAIL')
                this.googlePlus.logout().then(res => {
                    console.log('gmail logout then', res)
                }).catch(error => {
                    console.log('gmail')
                })
            }

            if (JSON.parse(localStorage.getItem('userData')).fb_id !== null) {
                this.fb.logout().then(res => {
                    console.log(res, 'logged OUt facebook');
                }).catch(err => {
                    // this.globalToast.presentToast('error logging out Facebook')
                    console.log(err, 'logout error');
                })
            }
            console.log('logout', data)
            localStorage.removeItem('userCredentialS')
            localStorage.removeItem('userFriends')
            localStorage.removeItem('profileToken')
            localStorage.removeItem('userData')
            localStorage.removeItem('deviceInfo')
            localStorage.removeItem('NewNotification')
            this.navCtrl.navigateRoot('');
            // this.router.navigateByUrl('');
        }, error => {
            console.log(error)


        });


    }

    checkToggle(event) {
        console.log('called');
        // if (!this.firstTimeChecked && !JSON.parse(localStorage.getItem('deviceInfo'))) {
        //     this.firstTimeChecked = true;
        //     return;
        // }
        console.log('toggled', event)
        this.httpService.post(apiUrls.notification + this.myId + '/toggle', {
            device_token: this.device.uuid,
        }).subscribe(data => {
            console.log('notification Api Result', data);
            localStorage.setItem('deviceInfo', event);
        }, error => {
            console.log(error)
        });
    }

    // isPushNotsOn() {
    //     return JSON.parse(localStorage.getItem('deviceInfo'))
    // }
    connectWithFb() {
        this.facebookLogin()
    }

    connectWithGmail() {
        console.log('gmail')
        this.googlePlus.login({
            // 'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
            'webClientId': '809110423923-g50h0u00h8oc6em367r3gktr31jt54p6.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
            'offline': false // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
        })
            .then(async (gmailResponse) => {
                console.log('gmail api response', gmailResponse)
                this.httpService.post(apiUrls.profileSetup + this.myId + '/connect-account', {
                    email: gmailResponse.email,
                    profileType: 1,
                    gmail_id: gmailResponse.userId,
                }).subscribe(data => {
                    console.log('connection Api Result', data);
                    localStorage.setItem('userData', JSON.stringify(data))
                    this.profileType = data.profileType
                    this.navCtrl.navigateRoot('alltabs/tabs/tab1');
                }, error => {
                    console.log('connection Api error', error)
                });

            })
            .catch(err => console.error('error', err));
    }

    async facebookLogin() {

        this.fb.login(['public_profile', 'email', 'user_friends'])
            .then(res => {
                this.fb.api('/' + res.authResponse.userID + '/?fields=id,email,name', [])
                    .then(userCredentials => {
                        this.fb.api('/' + res.authResponse.userID + '/?fields=picture.width(200).height(200)', [])
                            .then(userPicture => {
                                this.fb.api('/' + res.authResponse.userID + '/friends', [])
                                    .then(async (userFriends) => {
                                        console.log(userFriends)
                                        userFriends.data.forEach(value => {
                                            this.userFriends.push(value.id)
                                        })
                                        console.log('userfirends', this.userFriends)

                                        this.httpService.post(apiUrls.profileSetup + this.myId + '/connect-account', {
                                            email: userCredentials.email,
                                            profileType: 0,
                                            fb_id: userCredentials.id,
                                            friends: this.userFriends
                                        }).subscribe(data => {
                                            console.log('connection Api Result', data);
                                            localStorage.setItem('userData', JSON.stringify(data))
                                            localStorage.setItem('userFriends', JSON.stringify(data.friends))
                                            this.profileType = data.profileType
                                            this.navCtrl.navigateRoot('alltabs/tabs/tab1');
                                        }, error => {
                                            console.log('connection Api error', error)
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


    setPhone() {
        console.log('phone number' , this.setPhoneNumber)
        console.log('user Data set' , this.setPhoneNumber)
        console.log('before messenger Id set',localStorage.getItem('userData'))



        this.httpService.post(apiUrls.profileSetup + this.myId + '/add-phone', {
            phone: this.setPhoneNumber,
        }).subscribe(data => {
            console.log('add phone Api Result', data);
            let userData=JSON.parse(localStorage.getItem('userData'))
            userData.phone=data.phone
            localStorage.setItem('userData',JSON.stringify(userData))
            console.log('after messenger Id set',localStorage.getItem('userData'))
            this.phone=data.phone

        }, error => {
            console.log(error)
        });
    }

    setMessenger() {
        console.log('before messenger Id set',localStorage.getItem('userData'))
        console.log('messenger_id ' , this.setMessengerId)
        this.httpService.post(apiUrls.profileSetup + this.myId + '/add-messenger', {
            messenger_id: this.setMessengerId,
        }).subscribe(data => {
            let userData=JSON.parse(localStorage.getItem('userData'))
            userData.messenger_id=data.messenger_id
            localStorage.setItem('userData',JSON.stringify(userData))
            console.log('after messenger Id set',localStorage.getItem('userData'))
            this.messenger_id=data.messenger_id

        }, error => {
            console.log(error)
        });
    }
}
