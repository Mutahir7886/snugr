import {Component, ViewEncapsulation} from '@angular/core';
import {Facebook} from '@ionic-native/facebook/ngx';
import {apiUrls} from "../../environments/apis/api.urls";
import {HttpService} from "../../shared/services/http.service";
import {ActionSheetController, ModalController, NavController} from "@ionic/angular";
import {ModalPageComponent} from "./modal-page/modal-page.component";
import {cloneDeep} from 'lodash';
import {ActivatedRoute, Router} from "@angular/router";
import {TurnAllBulbModalComponent} from "./turn-all-bulb-modal/turn-all-bulb-modal.component";
import {SocialSharing} from "@ionic-native/social-sharing/ngx";
import {globalToast} from "../../shared/classes/globalToast";

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss'],
    encapsulation:ViewEncapsulation.None
})
export class Tab2Page {


    myUserId;
    groupList: any = [];
    friendList: any = []
    showGroups = false;
    currentPage: any;
    totalPages: any;
    name;
    username;
    profilePic;
    url: string = 'https://play.google.com/store/apps/details?id=snugrId';
    tab;



    constructor(private fb: Facebook,
                private httpService: HttpService,
                public modalController: ModalController,
                private router: Router,
                public navCtrl: NavController,
                private activatedRoute: ActivatedRoute,
                private socialSharing: SocialSharing,
                private globalToast: globalToast,
                public actionSheetController: ActionSheetController) {



        console.log('MY USER ID', this.myUserId)

        // this.fetchGroupData()
        // this.fetchFriendsData()
        this.activatedRoute.params.subscribe(params => {
            console.log('activated param enter')
            if (params.refresh === 'true') {
                console.log('yes')
                
                this.myUserId = JSON.parse(localStorage.getItem('userData'))._id;
                this.fetchGroupData()
                this.fetchFriendsData()
            }
            console.log('params', params);
            console.log('params123', params.refresh)
        });
        //here add friendlist=localstoroge
    }


    fetchGroupData() {
        console.log(JSON.parse(localStorage.getItem('userData'))._id)
        this.httpService.get(apiUrls.Groups + this.myUserId + '/group-list').subscribe(data => {
            console.log('data from getGroups api', data)
            this.groupList = data.data.rows
            this.currentPage = data.currentPage
            this.totalPages = data.totalPages
        }, error => {
            console.log('error in query api', error)
        });
    }

    fetchFriendsData() {
        console.log(JSON.parse(localStorage.getItem('userData'))._id)

        this.httpService.get(apiUrls.userFriends + this.myUserId + '/friend-list').subscribe(data => {
            console.log('data from userFriends api', data)
            this.friendList = data.friends
        }, error => {
            console.log('error in query api', error)
        })
    }

    ionViewWillEnter() {
        this.myUserId = JSON.parse(localStorage.getItem('userData'))._id;
        this.profilePic = JSON.parse(localStorage.getItem('userData')).profile
        this.name = JSON.parse(localStorage.getItem('userData')).name
        this.username = JSON.parse(localStorage.getItem('userData')).username
        console.log('12311111111111')
        this.fetchGroupData()
        this.fetchFriendsData()
    }

    async presentModal() {
        const friendList = cloneDeep(this.friendList)
        const modal = await this.modalController.create({
            component: ModalPageComponent,
            componentProps: {
                'friendList': friendList,
            }
        });
        await modal.present();

        await modal.onDidDismiss().then((res: any) => {
            if (res.data == true) {
                this.fetchGroupData()
            } else {
                console.log('modal dismiss', res)

            }
        });
    }

    createGroup() {
        this.presentModal();
    }

    deleteGroup(indexToDelete, groupId) {
        console.log('group list before delete', this.groupList)
        console.log('group Id', groupId)
        console.log('group item', this.myUserId)
        this.httpService.delete(apiUrls.Groups + groupId + '/' + this.myUserId).subscribe(data => {
            console.log('success on delete group', data)
            this.groupList.splice(indexToDelete, 1)

        }, error => {
            console.log('fail on delete group', error)

        })
        console.log('group delete after delete', this.groupList)
    }

    checkForAdmin(group) {
        for (let participant of group.participants) {
            if (participant.user_details._id == this.myUserId) {
                if (participant.is_admin == true) {
                    return true
                }
            }
        }
        return false
    }

    leaveGroup(indexToChange, groupId) {
        this.httpService.put(apiUrls.Groups + groupId + '/' + this.myUserId + '/leave-group', {}).subscribe(data => {
            console.log('success on delete group', data)
            this.groupList.splice(indexToChange, 1)


        }, error => {
            console.log('fail on delete group', error)

        })
    }

    showDetails(grpDetails) {
        const grpId = grpDetails._id
        console.log('group detail being sent', grpId)
        this.navCtrl.navigateRoot('details/' + grpId);
    }

    bulbStatus(grpItem) {
        return grpItem.bulb_status != false;
    }

    checkTotalMembers(item: any) {
        return item.participants.length
    }

    async openAllBulbModal() {
        const modal = await this.modalController.create({
            component: TurnAllBulbModalComponent,
            componentProps: {}
        });
        await modal.present();

        await modal.onDidDismiss().then((res: any) => {
            if (res.data == true) {
                this.fetchGroupData()
            } else {
                console.log('modal dismiss', res)

            }
        });
    }

    turnAllbulbs() {
        this.openAllBulbModal()

    }

    loadData($event: any) {
        if ($event) {
            console.log('INFINITE SCROLL', $event)
            if (this.currentPage < this.totalPages) {
                console.log('yes')
                this.httpService.get(apiUrls.Groups + this.myUserId + '/group-list?page=' + (this.currentPage + 1)).subscribe(data => {
                    console.log('data from getGroups api', data)
                    let groupListReturned = data.data.rows
                    console.log('before', this.groupList)
                    this.currentPage = this.currentPage + 1
                    console.log('cccc', this.currentPage)
                    this.groupList = this.groupList.concat(groupListReturned)
                    console.log('groupListReturned', groupListReturned)
                    console.log('after', this.groupList)
                    $event.target.complete();
                }, error => {
                    $event.target.complete();
                    console.log('error in query api', error)
                });

            } else {
                console.log('current page is larger than total pages', this.currentPage)
                $event.target.complete();

            }
        }

    }

    nameDiv(name: any) {
        return name[0]
    }

    Invite() {
        this.socialSharing.share('Hi, add me on the Snugr.\n' + 'My username is ' + this.username  + '\nInstall Snugr : ', 'Invitation', null, this.url).then(() => {
            // Success!
        }).catch(() => {
            // Error!
        });
    }


    turnOnAnonymous() {
        this.httpService.post(apiUrls.Bulb + this.myUserId + '/' + 'all-groups', {
            is_anonymous: true,
            bulb_action: true
        }).subscribe(data => {
            if (data.isSuccess == true) {
                this.fetchGroupData()
                // this.modalCtrl.dismiss(true)
            } else {
                console.log('bulbs can not be turned ON')
                let message = 'bulbs can not be turned ON'
                // this.presentToast(message)
                this.globalToast.presentToast(message)
                // this.modalCtrl.dismiss(true)
            }
        }, error => {
            this.globalToast.presentToast(error.name)
            // this.modalCtrl.dismiss(true)

            console.log(error)
        });
    }

    turnOff() {
        this.httpService.post(apiUrls.Bulb + this.myUserId + '/' + 'all-groups', {
            is_anonymous: true,
            bulb_action: false
        }).subscribe(data => {
            if (data.isSuccess == true) {
                this.fetchGroupData()

                // this.modalCtrl.dismiss(true)
            } else {
                let message = 'Bulbs can not be turned Off'
                this.globalToast.presentToast(message)
                // this.modalCtrl.dismiss(true)

                console.log('ERRRRRRRRRRRRROR')
            }
        }, error => {
            // this.errorToast(error.name)
            this.globalToast.presentToast(error.name)

            // this.modalCtrl.dismiss(true)

            console.log(error)
        });
    }

    turnOnByUser() {
        this.httpService.post(apiUrls.Bulb + this.myUserId + '/' + 'all-groups', {
            is_anonymous: false,
            bulb_action: true
        }).subscribe(data => {
            if (data.isSuccess == true) {
                this.fetchGroupData()

                // this.modalCtrl.dismiss(true)
            } else {
                console.log('Bulbs can not be turned ON')
                let message = 'Bulbs can not be turned On'
                // this.presentToast(message)
                this.globalToast.presentToast(message)

                // this.modalCtrl.dismiss(true)
            }
        }, error => {
            // this.errorToast(error.name)
            this.globalToast.presentToast(error.name)

            // this.modalCtrl.dismiss(true)

            console.log(error)
        });
    }

    async presentActionSheet() {

        const actionSheet = await this.actionSheetController.create({

            cssClass: 'my-custom-class',
            buttons: [

                {
                    text: 'Turn on All Groups',
                    cssClass:'allItemsActionSheet',
                    handler: () => {
                        console.log('Turn on All Groups');
                        this.turnOnByUser()
                    }
                }, {
                    text: 'Turn on All Groups Anonymously',
                    handler: () => {
                        console.log('Turn on All Groups Anonymously');
                        this.turnOnAnonymous()
                    }
                }, {
                    text: 'Turn Off All Groups',
                    handler: () => {
                        console.log('Turn Off All Groups');
                        this.turnOff()
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass:'cancelButton',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }]
        });
        await actionSheet.present();
    }

    turnAllByActionSheet(){
        this.presentActionSheet()

    }

}

