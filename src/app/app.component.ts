import {Component} from '@angular/core';

import {NavController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Router} from "@angular/router";
import {connectionRefused} from "../shared/classes/connectionRefused";
import {FirebaseX} from '@ionic-native/firebase-x/ngx';
import {globalToast} from "../shared/classes/globalToast";
import {newNotification} from "../shared/classes/newNotification";
import {map} from "rxjs/operators";
import {AngularFireDatabase} from "@angular/fire/database";

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    myUserId;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar, private navController: NavController,
        private router: Router,
        private checkConnection: connectionRefused,
        private firebaseX: FirebaseX,
        private navCtrl: NavController,
        private globalToast: globalToast,
        private newNotification: newNotification,
        private db: AngularFireDatabase,
    ) {
        this.initializeApp();
    }

    initializeApp() {


        this.platform.ready().then(() => {
            this.firebaseX.hasPermission().then((res1) => {
                console.log(res1);
                if(!res1){
                    this.firebaseX.grantPermission().then(res2 => {
                        console.log(res2);
                    })
                }
            });
            this.firebaseX.onMessageReceived()
                .subscribe(data => {
                    // this.newNotification.newNotification.next(true)

                    if (JSON.parse(localStorage.getItem('deviceInfo')) == true) {
                        console.log('yes on ')
                        console.log(data.body)
                        localStorage.setItem('NewNotification', JSON.stringify(true))
                        this.globalToast.notificationToast(data.body)
                    }
                    if (data.tap) {
                        console.log('User opened a notification', data)
                        if (data.type == '1') {
                            console.log('friend added')
                            this.navCtrl.navigateRoot(['/alltabs/tabs/tab1',{refresh: true}]);
                        } else if (data.type == '2') {
                            console.log('Group Listing')
                            this.router.navigateByUrl('/alltabs/tabs/tab2');

                        } else {
                            console.log('Added in a Particular Group')
                            console.log('data.group_id', data.group_id)
                            this.newNotification.newNotification.next(true)
                            this.navCtrl.navigateRoot('details/' + data.group_id);
                        }
                    }
                }, error => {
                    console.log('notification opening error')
                });

            this.checkConnection.initiateNetwork()
            if (localStorage.getItem('userCredentialS') !== null) {
                console.log('userpresent')
                this.navCtrl.navigateRoot('/alltabs/tabs/tab2');
            } else {
                console.log('no user logged before')
                this.navCtrl.navigateRoot('/');

            }
            this.statusBar.styleDefault();
            this.statusBar.backgroundColorByHexString('#ffffff');

            this.splashScreen.hide();
        });


    }
}
