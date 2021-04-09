import {Component, OnInit} from '@angular/core';
import {NavController} from "@ionic/angular";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpService} from "../../../shared/services/http.service";
import {apiUrls} from "../../../environments/apis/api.urls";
import {Device} from "@ionic-native/device/ngx";
import {FirebaseX} from "@ionic-native/firebase-x/ngx";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    formGroup: FormGroup;
    email:string;
    device_token:string;
    name:string;
    userId:string;
    profilePic;
    notificationToken;
    profileType;

    constructor(private router: Router,
                private navController: NavController,
                private formBuilder: FormBuilder,
                private httpService: HttpService,
                private device: Device,
                private firebaseX: FirebaseX,
                private navCtrl: NavController) {
        this.formGroup = this.formBuilder.group({
            username: ['', [Validators.required,]],
            phone:[''],
            messengerId:['']
        });

        this.firebaseX.getToken()
            .then(token => {
                this.notificationToken=token
                console.log(`The token is ${token}`)
            })
            .catch(error => console.error('Error getting token', error));
    }

    ngOnInit() {
        this.profileType = JSON.parse(localStorage.getItem('userData')).profileType
        if(this.profileType === 0){
            // fb profile was setup
            this.email = JSON.parse(localStorage.getItem('userData')).fb_mail
        }
        else if(this.profileType === 1){
            // gmail was setup
            this.email = JSON.parse(localStorage.getItem('userData')).gmail
        }
        this.profilePic = JSON.parse(localStorage.getItem('userData')).profile
        this.device_token = this.device.uuid
        this.name = JSON.parse(localStorage.getItem('userData')).name
        this.userId = JSON.parse(localStorage.getItem('userData'))._id
        console.log(this.email)
        console.log(this.device_token)
        console.log(this.name)
        console.log(this.username.value)
        console.log(this.profilePic)
    }

    get username(): FormControl {
        return this.formGroup.get('username') as FormControl;
    }
    get phone(): FormControl {
        return this.formGroup.get('phone') as FormControl;
    }
    get messengerId(): FormControl {
        return this.formGroup.get('messengerId') as FormControl;
    }
    login(formGroup) {
        console.log('username',this.username.value)
        console.log('phone',this.phone.value)
        console.log('messenger',this.messengerId.value)
        this.httpService.post(apiUrls.profileSetup + this.userId + '/profile-setup', {
            email: this.email,
            username: this.username.value,
            device_token: this.device_token,
            notification_token:this.notificationToken,
            profileType:this.profileType,
            phone:this.phone.value,
            messenger_id:this.messengerId.value
        }).subscribe(data => {
            console.log('Profile set',data)
            localStorage.setItem('profileToken', JSON.stringify(data.device.auth_token))
            localStorage.setItem('deviceInfo', JSON.stringify(data.device.push_nots))
            localStorage.setItem('userFriends', JSON.stringify(data.user.friends))
            localStorage.setItem('userCredentialS',JSON.stringify(data.user))
            localStorage.setItem('userData',JSON.stringify(data.user))
            this.navCtrl.navigateRoot('alltabs/tabs/tab1');
        }, error => {
            console.log(error)


        });
        console.log('12311')

    }

}
