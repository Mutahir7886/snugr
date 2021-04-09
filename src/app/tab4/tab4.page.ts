import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";
import {connectionRefused} from "../../shared/classes/connectionRefused";
import {FirebaseX} from "@ionic-native/firebase-x/ngx";
import {NavController} from "@ionic/angular";
import {GooglePlus} from "@ionic-native/google-plus/ngx";
import {globalToast} from "../../shared/classes/globalToast";
import {newNotification} from "../../shared/classes/newNotification";

@Component({
    selector: 'app-tab4',
    templateUrl: './tab4.page.html',
    styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
    notifications: any = [];
    myUserId;
    isLoading = true;
    showScroller =false;

    constructor(private db: AngularFireDatabase,
                private router: Router,
                private navCtrl: NavController,
                private googlePlus: GooglePlus,
                private globalToast: globalToast,
                private newNotification: newNotification) {
        this.notifications = [];

    }

    ionViewWillEnter() {

        console.log('view Entered')
        console.log('this.notifications', this.notifications)
        this.myUserId = JSON.parse(localStorage.getItem('userData'))._id;
        this.listNotification()
        localStorage.setItem('NewNotification', JSON.stringify(false))
        // this.newNotification.newNotification.next(false)

    }

    ionViewWillLeave() {
        this.newNotification.newNotification.next(false)

    }

    ngOnInit() {

    }


    listNotification() {


        this.db.list('notifications/' + this.myUserId + '/', ref => {
            return ref.orderByKey().limitToLast(10);
        })
            .snapshotChanges()
            .pipe(map(items => {             // <== new way of chaining
                return items.map(a => {
                    const data = a.payload.val();
                    const key = a.payload.key;
                    return {key, data, type: a.type};
                });
            }))
            .subscribe((res: any) => {
                this.isLoading = false
                console.log('res list',res)
                if (res.length==10){
                    this.showScroller =true
                }
                if (this.notifications.length === 0) {
                    console.log('Yes ')
                    this.notifications = res.reverse();
                    // this.newNotification.newNotification.next(true)

                } else {
                    // this.notifications = (res.filter(item => item.type === 'child_added')).reverse().concat(this.notifications);
                    for (let item of res) {
                        console.log('this.item', item)
                        if (item.type === 'child_added') {
                            console.log('child added')
                            const childIndex = this.notifications.findIndex(not => not.key === item.key);
                            if (childIndex === -1) {
                                this.notifications.unshift(item);
                                // this.newNotification.newNotification.next(true)

                                // localStorage.setItem('NewNotification',JSON.stringify(true))
                                // if (JSON.parse(localStorage.getItem('deviceInfo')) == true) {
                                //     this.globalToast.presentToast(item.data.body)
                                // }
                            }
                        } else if (item.type === 'child_changed') {
                            const childIndex = this.notifications.findIndex(not => not.key === item.key);
                            this.notifications[childIndex] = item;
                        }
                    }
                    // console.log('filter', res.filter(item => item.type === 'child_added'))
                    // this.notifications = (res.filter(item => item.type === 'child_added')).reverse().concat(this.notifications);
                }
                console.log('123', this.notifications);
            }, error => {
                this.isLoading = false

            });
    }

    checkNotification($event) {
        console.log('notification function')
        this.db.list('notifications/' + this.myUserId + '/', ref => {
            return ref.orderByKey().endAt(this.notifications[this.notifications.length - 1].key).limitToLast(10);
        })
            .snapshotChanges().pipe(map(items => {            // <== new way of chaining

            return items.map(a => {
                const data = a.payload.val();
                const key = a.payload.key;

                console.log('this.notifications', this.notifications)
                return {key, data};           // or {key, ...data} in case data is Obj
            });
        }))
            .subscribe((res: any) => {
                console.log('res before', res)
                res.pop();
                console.log('res after', res)
                // const notificationKeys = this.notifications.map(n => n.key);
                // for(let r of res){
                //     if(notificationKeys.include(r.key)){
                //         return;
                //     }
                // }
                if (res.length >= 1) {
                    this.notifications = this.notifications.concat(res.reverse());
                    console.log('after scroll 123', this.notifications);
                    $event.target.complete();

                }

                if (res.length ==0){
                    $event.target.complete();
                    this.showScroller =false

                }


            });

    }

    async loadData($event: any) {

        if (this.notifications.length >=10){
            console.log('scrolled')
            await this.checkNotification($event);
        }



        // $event.target.complete();

    }

    PerformNotification(notification, i) {
        console.log('notifiactoion clicked', notification)
        this.db.object('notifications/' + this.myUserId + '/' + notification.key).update({
            read: 'true'
        });
        this.notifications[i].data.read = 'true';
        if (notification.data.type == '1') {
            console.log('friend added')
            this.router.navigateByUrl('/alltabs/tabs/tab1');
        } else if (notification.data.type == '2') {
            console.log('Group Listing')
            this.router.navigateByUrl('/alltabs/tabs/tab2');

        } else {
            console.log('Added in a Particular Group')
            console.log('notification.data.group_id', notification.data.group_id)
            this.navCtrl.navigateForward(['details/' + notification.data.group_id, {notificationStatus: true}]);
        }
    }

    // checktime(s:any) {
    //     console.log('11111111111',s)
    //     let timesplit =s.split(' ')
    //     let hourSplit=timesplit[1].split(':')[0]
    //     let dateStamp=timesplit[0].split('/')
    //     let dateSplit=dateStamp[0]
    //     let monthSplit=dateStamp[1]
    //     let yearSplit=dateStamp[2]
    //     console.log('hour received',hourSplit)
    //     console.log('dateSplit',dateSplit)
    //     console.log('monthSplit',monthSplit)
    //     console.log('yearSplit',yearSplit)
    //     var date=new Date()
    //     let current_date=date.getDate()
    //     let current_hours=date.getHours()
    //     console.log('current hours',current_hours)
    //     console.log('current_date',current_date)
    //
    //     if(current_date>dateSplit){
    //         return current_date - dateSplit + 'day before'
    //     }
    //     else {
    //         if (current_hours>hourSplit){
    //             return current_hours-hourSplit + 'hours ago'
    //         }
    //     }
    //
    //
    //     // if (current_hours>12){
    //     //     console.log(current_hours + 'PM')
    //     // }
    //     // else {
    //     //     console.log(current_hours + 'PM')
    //     //
    //     // }
    //
    //
    //     // var date = new Date(s * 1000);
    //     // console.log(date)
    //     // var hours = date.getHours();
    //     // console.log(hours)
    //     //
    //     // var minutes = "0" + date.getMinutes();
    //     // console.log(minutes)
    //     // var seconds = "0" + date.getSeconds();
    //     // console.log(seconds)
    //
    // }

}
