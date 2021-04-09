import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {apiUrls} from "../../../environments/apis/api.urls";
import {HttpService} from "../../../shared/services/http.service";
import {
    ActionSheetController,
    AlertController,
    IonList,
    ModalController,
    NavController,
    Platform
} from "@ionic/angular";
import {ModalPageComponent} from "../modal-page/modal-page.component";
import {cloneDeep} from 'lodash';
import {AddParticpantModalComponent} from "../add-particpant-modal/add-particpant-modal.component";
import {globalToast} from "../../../shared/classes/globalToast";
import {TabsPage} from "../../tabs/tabs.page";
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {SocialSharing} from "@ionic-native/social-sharing/ngx";
import {map} from "rxjs/operators";
import {AngularFireDatabase} from "@angular/fire/database";

@Component({
    selector: 'app-group-detail',
    templateUrl: './group-detail.component.html',
    styleUrls: ['./group-detail.component.scss'],
})
export class GroupDetailComponent implements OnInit, AfterViewInit {
    @ViewChild('participants', {static: false}) private participantDiv: any;
    @ViewChild('chatbox', {static: false}) private chatbox: any;

    @HostListener('ionScroll', ['$event']) onScroll(event) {
        console.log(event.detail.scrollTop)
        console.log(event.detail.scrollHeight)
        console.log('im scrolling')
        if (event.detail.scrollTop > 0) {
                this.header = 'sticky'
                this.content = 'sticky1'
                console.log('this.content',this.content)

        } else {

                this.header = '';
                this.content = '';
                console.log('this.content',this.content)





        }
    }

    myUserId;
    DeleteOrLeaveTextToShow;
    DeleteOrLeaveTextIconToShow;
    DeleteOrLeaveTextAction;
    groupId;
    groudDetail;
    showEdit = true;
    admin;
    myFriendList: any = [];
    showSave: boolean = false;
    showEditIcon: boolean = true;
    groupName;
    notificationStatus;
    editButton: string;
    sub1$: any;
    addParticipant;
    showSegment: any = 'chat';
    chatMessages: any = [];
    messageEntered: any;
    showScroller = false;
    chatId = 0;
    disableEnter = false;
    anonymousToggle = false;
    header;
    content ='';

    constructor(private activatedRoute: ActivatedRoute,
                private httpService: HttpService,
                private platform: Platform,
                public navCtrl: NavController,
                public modalController: ModalController,
                public alertController: AlertController,
                private globalToast: globalToast,
                public actionSheetController: ActionSheetController,
                private iab: InAppBrowser,
                private socialSharing: SocialSharing,
                private db: AngularFireDatabase) {
        this.chatMessages = []

        this.activatedRoute.params.subscribe(params => {
            console.log('PARAMETER GOT IN DETAIL PAGE ', params);
            this.groupId = params.id
            this.notificationStatus = params.notificationStatus
            console.log(this.groupId);
            console.log(this.notificationStatus);

        });

        this.sub1$ = this.platform.resume.subscribe(value => {
            console.log('this.groupId', this.groupId)
            this.myUserId = JSON.parse(localStorage.getItem('userData'))._id;
            console.log('this.myUserId', this.myUserId)
            console.log('platform resume')

            if (this.groupId) {
                this.httpService.get(apiUrls.Groups + this.groupId + '/' + this.myUserId).subscribe(data => {
                    console.log('detail data from groups', data)
                    this.groudDetail = data
                    // this.groudDetail = data
                    this.groupName = this.groudDetail.name
                }, error => {
                    console.log('error in query api', error)
                });
            }
        })
    }

    ngOnInit() {
        console.log('Entered in NgOnInit')
        // setTimeout(abc=>{
        //     if (this.participantDiv.nativeElement.scrollHeight>1){
        //             console.log('WORKING')
        //
        //     }
        //
        //
        // },500)
        // if (this.participantDiv.nativeElemen.scrol>1){
        //     console.log('WORKING')
        // }
    }

    ngAfterViewInit(): void {
        // console.log('PARTICIPANT DIV', this.participantDiv)
        // if (this.participantDiv.nativeElement.scrollTop > 1) {
        //     console.log('WORKING')
        //     this.header = 'sticky'
        //
        // } else {
        //     this.header = null;
        // }
    }

    checkScrollClass(): string {

        let className = '';
        if (this.participantDiv && this.participantDiv.el && this.participantDiv.el.scrollTop > 0) {
            className = 'sticky';

        }
        return className;
    }

    ionViewWillUnload() {
        this.sub1$.unsubscribe();
    }

    ionViewWillLeave() {
        this.sub1$.unsubscribe();
    }

    ionViewWillEnter() {
        console.log('this.chatMessages', this.chatMessages)
        console.log('123')
        this.myUserId = JSON.parse(localStorage.getItem('userData'))._id;
        this.fetchFriendsData()
        this.getGroupDetails()
    }

    ionViewDidLeave() {
        // this.chatMessages=[]
    }

    getGroupDetails() {
        if (this.groupId) {
            this.httpService.get(apiUrls.Groups + this.groupId + '/' + this.myUserId).subscribe(data => {
                console.log('detail data from groups', data)
                this.groudDetail = data
                this.groupName = this.groudDetail.name
                this.chat()
            }, error => {
                console.log('error in query api', error)
            });
        }

    }

    fetchFriendsData() {
        this.httpService.get(apiUrls.userFriends + this.myUserId + '/friend-list').subscribe(data => {
            console.log('data from userFriends api', data)
            this.myFriendList = data.friends
            console.log('this.myFriendList', this.myFriendList)
        }, error => {
            console.log('error in query api', error)
        })
    }


    checkadmin() {
        for (let item of this.groudDetail.participants) {
            if (item.is_admin == true) {
                return item.user_details.name
            }
        }
    }

    checkparticipantadmin(participantToCheck) {
        if (participantToCheck.is_admin == true) {
            return 'Admin'
        }
    }

    checkBulbStatus() {
        return this.groudDetail.bulb_status != false;
    }

    HideUserStatus() {
        // return this.groudDetail.bulb_status != false;
        if (this.groudDetail.bulb_status == true) {
            return false
        } else {
            return true

        }
    }


    turnbulbAnonymous() {
        this.httpService.post(apiUrls.Bulb + this.groudDetail._id + '/' + this.myUserId + '/toggle', {
            is_anonymous: true
        }).subscribe(data => {
            console.log('turn bulb ananymous ', data)
            this.groudDetail = data
        }, error => {
            console.log(error)


        });
    }

    turnbulb() {
        this.httpService.post(apiUrls.Bulb + this.groudDetail._id + '/' + this.myUserId + '/toggle', {
            is_anonymous: false
        }).subscribe(data => {
            console.log('turn bulb by user ', data)
            this.groudDetail = data
        }, error => {
            console.log(error)
        });
    }

    checkUser() {
        if (this.groudDetail.is_anonymous == true) {
            return 'Anonymous'
        } else {
            for (let item of this.groudDetail.participants) {
                if (this.groudDetail.bulb_user_id == item.user_details._id) {
                    return item.user_details.name

                }
            }
        }
    }


    checkUserProfile() {
        if (this.groudDetail.is_anonymous == true) {
            return 'assets/images/anonymous-bulb-user.png'
        } else {
            for (let item of this.groudDetail.participants) {
                if (this.groudDetail.bulb_user_id == item.user_details._id) {
                    return item.user_details.profile

                }
            }
        }
    }


    moveBack() {
        console.log('123')
        if (this.notificationStatus == 'true') {
            console.log('YES ITS TRUE')
            this.navCtrl.navigateBack(['alltabs/tabs/tab4', {refresh: true}]);
        } else {
            this.navCtrl.navigateBack('alltabs/tabs/tab2');

        }
    }

    checkUserButton() {
        if (this.groudDetail.bulb_status == true) {
            if (this.groudDetail.is_anonymous === true && this.groudDetail.bulb_status === true) {
                return true;
            } else {


                return false;
            }
        } else {
            return false
        }

    }

    checkAnanoymousButton() {

        if (this.groudDetail.bulb_status === true) {
            if (this.groudDetail.is_anonymous === false && this.groudDetail.bulb_status === true) {
                return true;
            } else {

                return false;
            }
        } else {
            return false;
        }
    }

    async presentModal() {
        const addedFriendList = cloneDeep(this.groudDetail.participants)
        const MyFriendList = cloneDeep(this.myFriendList)
        const modal = await this.modalController.create({
            component: AddParticpantModalComponent,
            componentProps: {
                'addedFriendList': addedFriendList,
                'myFriendList': MyFriendList,
                'groupId': this.groudDetail._id
            }
        });
        await modal.present();

        await modal.onDidDismiss().then((res: any) => {
            if (res.data == true) {
                this.getGroupDetails()
            } else {
                console.log('modal dismiss', res)

            }
            console.log('modal dismiss', res)
            // this.getGroupDetails()
            // this.fetchGroupData()
        });
    }


    AddParticpants() {
        this.presentModal();
    }

    checkforAdmin() {
        for (let item of this.groudDetail.participants) {
            if (item.is_admin == true && item.user_details._id == this.myUserId) {
                return true
            }
        }
        return false
    }

    deleteGroup() {
        this.deleteConfirm()
    }

    async deleteConfirm() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Confirm!',
            message: 'Are you sure you want to <strong>Delete</strong>',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Okay',
                    handler: () => {
                        this.httpService.delete(apiUrls.Groups + this.groupId + '/' + this.myUserId).subscribe(data => {
                            console.log('success on delete group', data)
                            this.navCtrl.navigateBack(['alltabs/tabs/tab2', {refresh: true}]);

                        }, error => {
                            console.log('fail on delete group', error)

                        })
                    }
                }
            ]
        });

        await alert.present();
    }

    async leaveConfirm() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Confirm!',
            message: 'Are you sure you want to <strong>Leave</strong>',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Okay',
                    handler: () => {
                        this.httpService.put(apiUrls.Groups + this.groupId + '/' + this.myUserId + '/leave-group', {}).subscribe(data => {
                            console.log('success on delete group', data)
                            this.navCtrl.navigateBack(['alltabs/tabs/tab2', {refresh: true}]);
                        }, error => {
                            console.log('fail on delete group', error)
                        })
                    }
                }
            ]
        });

        await alert.present();
    }

    leaveGroup() {
        this.leaveConfirm()

    }

    check() {
        this.showEdit = false
        this.showSave = true;
        this.showEditIcon = false;
    }

    saveGroupName() {
        console.log('edited name', this.groupName)

        this.httpService.put(apiUrls.Groups + this.groupId + '/' + this.myUserId + '/update-name', {
            name: this.groupName,
        }).subscribe(data => {
            console.log('result after update name', data)
            this.showEdit = true;
            this.showSave = false;
            this.showEditIcon = true;
            this.groudDetail = data
        }, error => {
            console.log('after update name', error)
        })
    }

    ButtonCheck() {

    }

    check123() {

    }

    nameSuffix(groupName: any) {
        return groupName[0]

    }

    // checkinput($event) {
    //     if ($event.data.length >14)
    //     {
    //         return $event.data = $event.data.substring(0, 14);
    //     }
    //     console.log('input of name', $event);
    //     // return true;
    // }
    openDetails() {
        this.presentActionSheet()

    }

    async presentActionSheet() {
        console.log('this.showsave', this.showSave)
        console.log('this.showEdit', this.showEdit)

        if (this.checkforAdmin() == true) {
            this.DeleteOrLeaveTextToShow = 'Delete this Group'
            this.DeleteOrLeaveTextIconToShow = 'trash'
            this.addParticipant = 'Allow'
        } else {
            this.DeleteOrLeaveTextToShow = 'Leave this Group'
            this.DeleteOrLeaveTextIconToShow = 'exit'
            this.addParticipant = 'NotAllow'

        }

        if (this.showSave == true && this.showEdit == false) {
            this.editButton = 'HideEdit'
        } else {
            console.log('yes in to this')
            this.editButton = 'ShowEdit'
        }
        const actionSheet = await this.actionSheetController.create({

            // header: 'Albums',
            cssClass: 'my-custom-class',
            buttons: [

                {
                    text: this.DeleteOrLeaveTextToShow,
                    icon: this.DeleteOrLeaveTextIconToShow,
                    handler: () => {
                        if (this.checkforAdmin() == true) {
                            this.deleteGroup()
                        } else {
                            this.leaveGroup()
                        }
                        console.log('Delete clicked');
                    }
                }, {
                    text: 'Edit Group Name',
                    icon: 'pencil',
                    cssClass: this.editButton,
                    handler: () => {
                        this.check()
                        console.log('Share clicked');
                    }
                }, {
                    text: 'Add Participants',
                    icon: 'add',
                    cssClass: this.addParticipant,
                    handler: () => {
                        this.AddParticpants()
                    }
                }, {
                    text: 'Cancel',
                    icon: 'close',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }]
        });
        await actionSheet.present();
    }


    checkName(name: any) {
        return name[0]
    }

    segmentChanged(ev: any) {
        console.log('Segment changed', ev);
        this.showSegment = ev.detail.value
    }

    addUrl(fb_id: any) {
        console.log('fb_id', fb_id)
        console.log("https://m.me/" + JSON.stringify(fb_id))
        return "https://m.me/" + JSON.stringify(fb_id)
    }

    openExternal(url: string) {
        if (url) {
            if (url.includes('https')) {
                this.iab.create(url, '_system');
            } else {
                this.globalToast.presentToast('Not available')

            }
        } else {
            this.globalToast.presentToast('Not available')

        }
        console.log('url', url)
        // this.iab.create(url, '_system');
    }

    sendSms(phone) {
        console.log('sending sms')

        if (phone) {
            this.socialSharing.shareViaSMS('', phone,).then(() => {

                // Success!
            }).catch(() => {
                // Error!
            });
        } else {
            this.globalToast.presentToast('Phone Number not available')
        }

    }

    removeParticipant(participantId, idToDelete) {
        console.log('participantId', participantId)
        this.httpService.put(apiUrls.Groups + this.groudDetail._id + '/' + this.myUserId + '/remove-participant', {
            participant_id: participantId
        }).subscribe(data => {
            console.log('participant deleted successfully ', data)
            this.groudDetail.participants.splice(idToDelete, 1)
        }, error => {
            console.log(error)


        });
    }

    chat() {
        if (this.groudDetail) {
            console.log('GROUP DETAIL ID', this.groudDetail._id)
            this.db.list('groups/' + this.groudDetail._id + '/', ref => {
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

                    if (res.length == 10) {
                        this.showScroller = true
                    }
                    console.log('Subscriber')
                    // res = res.reverse()
                    if (this.chatMessages.length == 0) {
                        console.log('res list if length is zero', res)
                        res.forEach(val => {
                            this.groudDetail.participants.forEach(p => {
                                if (p.user_details._id == val.data.userid) {
                                    val.data.user = p.user_details;
                                    val.data.keytoCheck = val.key
                                    this.chatMessages.push(val.data)
                                    console.log('chat messages array', this.chatMessages)
                                }
                            })
                        })
                    } else {
                        console.log('this.res if length is not zero', res)
                        for (let item of res) {
                            if (item.type === 'child_added') {
                                console.log('child added')
                                console.log('this.chatmessages before', this.chatMessages)

                                const childIndex = this.chatMessages.findIndex(not => not.date === item.data.date);
                                if (childIndex === -1) {
                                    console.log('add this')
                                    this.groudDetail.participants.forEach(p => {
                                        if (p.user_details._id == item.data.userid) {
                                            item.data.user = p.user_details;
                                            item.data.keytoCheck = item.key
                                            this.chatMessages.push(item.data)
                                            setTimeout(() => {
                                                const element = document.getElementById(item.data.date);
                                                element.scrollIntoView({behavior: 'smooth'});

                                            }, 100);
                                            console.log('chat messages array', this.chatMessages)
                                        }
                                    })
                                }
                            }
                        }
                    }
                }, error => {

                });
        }

    }

    enterMessage() {
        this.disableEnter = true
        console.log('message entered', this.messageEntered);
        const items = this.db.list('groups/' + this.groudDetail._id);
        items.push({
            userid: this.myUserId,
            date: Date.now(),
            message: this.messageEntered
        })
            .then(value => {
                this.disableEnter = false

                // // this.db.object('groups/' + this.groudDetail._id + '/' + Date.now()).set({
                //     userid: this.myUserId,
                //     date: Date.now(),
                //     message: this.messageEntered
                // }).then(value => {
                console.log(value)
                this.chatId = this.chatId + 1;
                this.messageEntered = ''
            }).catch(e => {
            console.log('error in firebase setting', e)
        })
    }

    scrollMessages($event) {
        console.log('notification function')
        console.log(this.chatMessages[0])
        console.log(this.chatMessages)
        this.db.list('groups/' + this.groudDetail._id + '/', ref => {
            return ref.orderByKey().endAt(this.chatMessages[0].keytoCheck.toString()).limitToLast(10);
        })
            .snapshotChanges().pipe(map(items => {            // <== new way of chaining
            return items.map(a => {
                const data = a.payload.val();
                const key = a.payload.key;
                return {key, data};           // or {key, ...data} in case data is Obj
            });
        }))
            .subscribe((res: any) => {
                console.log('res before', res)
                res.pop();
                console.log('res after', res)
                res = res.reverse()

                if (res.length >= 1) {
                    res.forEach(val => {
                        this.groudDetail.participants.forEach(p => {
                            if (p.user_details._id == val.data.userid) {
                                val.data.user = p.user_details;
                                val.data.keytoCheck = val.key
                                this.chatMessages.unshift(val.data)
                                console.log('chat messages array', this.chatMessages)
                            }
                        })
                    })

                    $event.target.complete();

                }

                if (res.length == 0) {
                    this.showScroller = false
                    $event.target.complete();
                    // this.showScroller =false

                }


            });

    }

    async loadData($event: any) {

        if (this.chatMessages.length >= 10) {
            console.log('scrolled')
            await this.scrollMessages($event);
        }
    }

    AdminCantBeDeleted() {
        for (let item of this.groudDetail.participants) {
            if (item.user_details._id == this.myUserId) {
                return false
            }
        }
        return true
    }

    checkforToggle(event) {
        console.log('event handler', event.detail.checked)
        if (event.detail.checked == true) {
            console.log('variable is true')
            this.anonymousToggle = true;
            console.log('this.anonymousToggle', this.anonymousToggle)

        } else {
            console.log('variable is false')
            this.anonymousToggle = false;
            console.log('this.anonymousToggle', this.anonymousToggle)

        }
    }


    bulbToggling() {
        if (this.groudDetail.bulb_status == true) {
            if (this.groudDetail.is_anonymous == false) {
                if (this.groudDetail.bulb_user_id == this.myUserId) {
                    if (this.anonymousToggle == true) {
                        console.log('Api cal for anonymous bulb switching')
                        this.httpService.post(apiUrls.Bulb + this.groudDetail._id + '/' + this.myUserId + '/toggle', {
                            is_anonymous: true
                        }).subscribe(data => {
                            console.log('turn bulb ananymous ', data)
                            this.groudDetail = data
                        }, error => {
                            console.log(error)

                        });
                    } else {
                        console.log('Api cal for  bulb switching')
                        this.httpService.post(apiUrls.Bulb + this.groudDetail._id + '/' + this.myUserId + '/toggle', {
                            is_anonymous: false
                        }).subscribe(data => {
                            console.log('turn bulb ananymous ', data)
                            this.groudDetail = data
                        }, error => {
                            console.log(error)

                        });
                    }
                } else {
                    this.globalToast.presentToast('Some one has already turned on the bulb')
                }
            } else {
                if (this.groudDetail.bulb_user_id == this.myUserId) {
                    if (this.anonymousToggle == true) {
                        console.log('Api cal for anonymous bulb switching')
                        this.httpService.post(apiUrls.Bulb + this.groudDetail._id + '/' + this.myUserId + '/toggle', {
                            is_anonymous: true
                        }).subscribe(data => {
                            console.log('turn bulb ananymous ', data)
                            this.groudDetail = data
                        }, error => {
                            console.log(error)

                        });
                    } else {
                        console.log('Api cal for  bulb switching')
                        this.httpService.post(apiUrls.Bulb + this.groudDetail._id + '/' + this.myUserId + '/toggle', {
                            is_anonymous: false
                        }).subscribe(data => {
                            console.log('turn bulb ananymous ', data)
                            this.groudDetail = data
                        }, error => {
                            console.log(error)

                        });
                    }
                } else {
                    this.globalToast.presentToast('Some one has already turned on the bulb')
                }
            }
        } else {
            if (this.anonymousToggle == true) {
                console.log('Api cal for anonymous bulb switching')
                this.httpService.post(apiUrls.Bulb + this.groudDetail._id + '/' + this.myUserId + '/toggle', {
                    is_anonymous: true
                }).subscribe(data => {
                    console.log('turn bulb ananymous ', data)
                    this.groudDetail = data
                }, error => {
                    console.log(error)

                });
            } else {
                console.log('Api cal for  bulb switching')
                this.httpService.post(apiUrls.Bulb + this.groudDetail._id + '/' + this.myUserId + '/toggle', {
                    is_anonymous: false
                }).subscribe(data => {
                    console.log('turn bulb ananymous ', data)
                    this.groudDetail = data
                }, error => {
                    console.log(error)

                });
            }
        }


    }

}
