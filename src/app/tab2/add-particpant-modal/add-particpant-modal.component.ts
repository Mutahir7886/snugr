import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from "@ionic/angular";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import {apiUrls} from "../../../environments/apis/api.urls";
import {HttpService} from "../../../shared/services/http.service";
import {filter as LodashFilter} from 'lodash';

@Component({
    selector: 'app-add-particpant-modal',
    templateUrl: './add-particpant-modal.component.html',
    styleUrls: ['./add-particpant-modal.component.scss'],
})
export class AddParticpantModalComponent implements OnInit {
    addedParticipants = [];
    searchForMoreFriends: FormGroup;
    myId;
    searchResults;
    myFriendList: any = [];
    displayArray: any = [];
     newParticipants: any =[];
     groupId: any =[];


    constructor(private navParams: NavParams,
                private formBuilder: FormBuilder,
                private httpService: HttpService,
                private modalCtrl: ModalController) {
        this.searchForMoreFriends = this.formBuilder.group({
            Search: [''],
        });
        this.addedParticipants = this.navParams.get('addedFriendList')
        this.myFriendList = this.navParams.get('myFriendList')
        this.groupId = this.navParams.get('groupId')
        console.log('added list', this.addedParticipants)
        console.log('this.myFriendList', this.myFriendList)
        console.log('this.groupId', this.groupId)
    }

    ngOnInit() {
        this.searchResult.valueChanges
            .pipe(
                debounceTime(500)
            )
            .subscribe((value: string) => {
                console.log(value)
                if (value) {
                    this.searchInFriends(value)
                }

            });
    }

    ionViewWillEnter() {
        this.myId=JSON.parse(localStorage.getItem('userData'))._id
        console.log(this.addedParticipants,'asd')
    }

    get searchResult(): FormControl {
        return this.searchForMoreFriends.get('Search') as FormControl;
    }

    isFriend(searchedFriend) {
        for (let friend of this.addedParticipants) {
            if (friend.user_details.username === searchedFriend.friend_details.username) {
                return true;
            }
        }
        return false;
    }

    AddParticipants() {
        console.log(this.newParticipants)
        this.httpService.post(apiUrls.Groups + this.groupId +'/' + this.myId +'/' + 'add-participant', {
            participants: this.newParticipants,
        }).subscribe(data => {
            this.modalCtrl.dismiss(true)
            console.log('data from add participants', data)
            // this.router.navigate(['alltabs/tabs/tab1']);
        }, error => {
            console.log(error)
        });
        //Api Hit
        //check for admin to add participants
        //detail flow
    }

    dismiss() {
        this.modalCtrl.dismiss(false)
    }

    addFriendtoParticipants(item: any,index) {
        console.log('added participants before adding',this.addedParticipants)
        console.log('friend to be added', item)
        this.addedParticipants.push({'user_details':item.friend_details})
        console.log('addedParticipants before adding',this.addedParticipants)
        this.newParticipants.push({'user_id':item.friend_details._id})
        console.log('new Participants',this.newParticipants)

    }

    searchInFriends(value: string = '') {
        console.log('got value from search', value)
        console.log('this.myFriend',this.myFriendList)
        this.displayArray = LodashFilter(this.myFriendList, function (o) {
            return o.friend_details.name.toLowerCase().includes(value.toLowerCase());
        });
        console.log('after search', this.displayArray)
        // this.friendListInModal=dispArray

    }

    checkbox($event,item,i) {
        console.log('checkbox event',$event)
        console.log('item',$event)
        // console.log('item',$event)
        console.log('index ',i)
        if ($event ==true){
            this.myFriendList[i].isChecked=true
            // item.friend_details.isChecked=true
            console.log('item',item)

            this.newParticipants.push({'user_id':item.friend_details._id})
            console.log('new Participants',this.newParticipants)
        }
        else if ($event ==false){
            // item.friend_details.isChecked=false
            this.myFriendList[i].isChecked=false
            console.log('item',item)

            this.newParticipants.forEach((value,index)=>{
                if (item.friend_details._id==value.user_id){
                   this.newParticipants.splice(index,1)
                }
            })
            // let index=i - this.newParticipants.length
            // console.log(' new participant index to splice',index)
            // this.newParticipants.splice(index,1)
            console.log('new Participants',this.newParticipants)
        }
        // console.log('added participants before adding',this.addedParticipants)
        // console.log('friend to be added', item)
        // this.addedParticipants.push({'user_details':item.friend_details})
        // console.log('addedParticipants before adding',this.addedParticipants)

    }

    checkName(name: any) {
        return name[0]
    }
}
