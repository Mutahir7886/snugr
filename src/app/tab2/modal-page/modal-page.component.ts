import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from "@ionic/angular";
import {apiUrls} from "../../../environments/apis/api.urls";
import {HttpService} from "../../../shared/services/http.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import {filter as LodashFilter} from 'lodash';
import {globalToast} from "../../../shared/classes/globalToast";

@Component({
    selector: 'app-modal-page',
    templateUrl: './modal-page.component.html',
    styleUrls: ['./modal-page.component.scss'],
})
export class ModalPageComponent implements OnInit {
    friendListInModal: any = [];
    groupName: string='';
    participants: any = [];
    myUserId;
    searchFriendForm: FormGroup;
    dispArray=[];

    constructor(
        private modalCtrl: ModalController,
        private navParams: NavParams,
        private httpService:HttpService,
        private formBuilder: FormBuilder,
        private globalToast:globalToast) {
        this.searchFriendForm = this.formBuilder.group({
            Search: [''],
        });
        this.friendListInModal = this.navParams.get('friendList')

        console.log('modal data', this.friendListInModal)
        this.searchFriends()
    }
    ionViewDidLeave() {

        this.participants=[];
        this.groupName='';
    }
    ionViewWillEnter(){
        this.myUserId= JSON.parse(localStorage.getItem('userData'))._id
    }
    ngOnInit() {
        this.Search.valueChanges
            .pipe(
                debounceTime(500)
            )
            .subscribe((value: string) => {
                console.log(value)
                this.searchFriends(value)
            });
    }

    get Search(): FormControl {
        return this.searchFriendForm.get('Search') as FormControl;
    }
    dismiss() {
        this.participants=[];
        this.groupName=''
        this.modalCtrl.dismiss(false)

    }

    addParticipants(friendAdded, index) {
        this.dispArray[index].selected = true;
        console.log('friend list', this.dispArray)
        this.participants.push(friendAdded)
        console.log('added participant', this.participants)
    }


    createGroup() {
        // if(this.groupName.length>15){
        //     this.globalToast.presentToast('Name can not be greater than 15 characters')
        // }
        let participantToPass:any =[]
        console.log('group name',this.groupName)
        console.log('participants',this.participants)
        for(let eachParticipant of this.participants){
            participantToPass.push({'user_id':eachParticipant.friend_details._id})
        }
        console.log('participantsToPass',participantToPass)

        this.httpService.post(apiUrls.Groups + this.myUserId, {
            name: this.groupName,
            participants: participantToPass,
        }).subscribe(data => {
            this.modalCtrl.dismiss(true)
            console.log('data from create group api', data)
            // this.router.navigate(['alltabs/tabs/tab1']);
        }, error => {
            this.modalCtrl.dismiss(true)
            console.log(error)
        });
    }

     searchFriends(value: string = '') {
        console.log('got value from search',value)
         console.log(this.friendListInModal)
         // let dispArray;
         this.dispArray = LodashFilter(this.friendListInModal, function (o) {
             return o.friend_details.name.toLowerCase().includes(value.toLowerCase());
         });
         console.log('after search',this.dispArray)
         // this.friendListInModal=dispArray

    }

    checkboxParticipant(checked: boolean | "checked", item: any, i: number) {
        console.log('checked',checked)
        console.log('item',item)
        console.log('index',i)
        console.log('friend list', this.dispArray)
        console.log('participants',this.participants)


        if (checked ==true){
            this.friendListInModal[i].isChecked=true

            console.log('checked true')
            this.participants.push(item)
            console.log('added participant', this.participants)
        }
        else if (checked ==false){
            // item.friend_details.isChecked=false
            this.friendListInModal[i].isChecked=false
            this.participants.forEach((value,index)=>{
                if (item._id ==value._id){
                    this.participants.splice(index,1)
                }
            })
        }

        console.log('participant list final', this.participants)

    }

    // checkName($event: any) {
    //     if($event.detail>12){
    //         return this.groupName.substr(0,12)
    //     }
    //     console.log($event)
    // }
    checkName(name: any) {
        return name[0]
    }
}
