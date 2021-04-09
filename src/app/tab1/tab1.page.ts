import {Component} from '@angular/core';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';
import {UniqueDeviceID} from '@ionic-native/unique-device-id/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {Uid} from "@ionic-native/uid/ngx";
import {Device} from '@ionic-native/device/ngx';
import {apiUrls} from "../../environments/apis/api.urls";
import {HttpService} from "../../shared/services/http.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
    // user_login: any = {};
    // UserImage: any;
    // private gotUserImage: boolean = false;
    userFriends: any;
    querySearch: any;
    myId;
    searchResults: any
    showFriends = false;
    searchForm: FormGroup;
    loadingSearch: boolean = false;
    currentPage;
    totalPage;
    url: string = 'https://play.google.com/store/apps/details?id=snugrId'

    constructor(private fb: Facebook,
                private uid: Uid,
                private androidPermissions: AndroidPermissions,
                private device: Device,
                private httpService: HttpService,
                private formBuilder: FormBuilder,
                private socialSharing: SocialSharing,
                private activatedRoute: ActivatedRoute,
    ) {
        this.activatedRoute.params.subscribe(params => {
            console.log('activated param enter')
            if (params.refresh === 'true') {
                console.log('yes')
                this.myId = JSON.parse(localStorage.getItem('userData'))._id;
                this.fetchFriendData()
            }
            console.log('params', params);
            console.log('params123', params.refresh)
        });
        this.searchForm = this.formBuilder.group({
            Search: [''],
        });
        if (localStorage.getItem('userFriends')) {
            console.log('setting user Friends from Local storage')
            this.userFriends = JSON.parse(localStorage.getItem('userFriends'))
            console.log(this.userFriends)
        }
        // this.fetchFriendData();
        this.SearchFriend.valueChanges
            .pipe(
                debounceTime(500)
            )
            .subscribe((value: string) => {
                console.log(value)
                if (value) {
                    this.loadingSearch = true

                    this.httpService.get(apiUrls.searchUser + this.myId + '/search?term=' + value).subscribe(data => {
                        this.loadingSearch = false
                        console.log('all users with query', data.rows)
                        this.searchResults = data.data.rows
                        this.currentPage = data.currentPage;
                        this.totalPage = data.totalPages
                        console.log('searchResults', this.searchResults)
                        // this.searchResults = data.rows
                        // console.log('searchResults', this.searchResults)
                    }, error => {
                        this.loadingSearch = false

                        console.log('error in query api', error)

                    })
                }

            });



    }

    get SearchFriend(): FormControl {
        return this.searchForm.get('Search') as FormControl;
    }

    fetchFriendData() {
        this.httpService.get(apiUrls.userFriends + this.myId + '/friend-list').subscribe(data => {
            console.log('data from userFriends api', data)
            this.userFriends = data.friends
            localStorage.setItem('userFriends', JSON.stringify(data.friends))
            console.log('userFriends', this.userFriends)
        }, error => {
            console.log('error in query api', error)

        })
    }

    ionViewWillEnter() {
        console.log('friendViewEntered')
        this.myId = JSON.parse(localStorage.getItem('userData'))._id
        this.fetchFriendData()
    }

    ionViewDidLeave() {
        this.querySearch = ''
        this.SearchFriend.setValue('')
        this.searchResults = null
    }

    searchFriends() {
        console.log(this.myId)
        console.log(this.querySearch)
        console.log(apiUrls.searchUser)
        this.httpService.get(apiUrls.searchUser + this.myId + '/search?term=' + this.querySearch).subscribe(data => {
            console.log('all users with query', data)
            this.searchResults = data.rows
            console.log('searchResults', this.searchResults)
        }, error => {
            console.log('error in query api', error)

        })
    }

    isFriend(username: string) {
        for (let friend of this.userFriends) {
            if (friend.friend_details.username === username) {
                return true;
            }
        }
        return false;
    }

    addFriend(FriendFbID, friendID) {
        this.httpService.post(apiUrls.addFriends + this.myId + '/add-friend', {
            friend_id: friendID,
            fb_id: FriendFbID,
            type: 1
        }).subscribe(data => {
            console.log('data from add friend api', data)
            console.log('this.userFriends before adding this', this.userFriends)
            this.userFriends.unshift(data)
            console.log('this.userFriends after adding this', this.userFriends)
            localStorage.setItem('userFriends', JSON.stringify(this.userFriends))


            // this.router.navigate(['alltabs/tabs/tab1']);
        }, error => {
            console.log(error)

        });

    }

    // userEnteredSearch($event: Event) {
    //     console.log('abc',$event)
    //     console.log($event['data']);
    //     if($event['data']){
    //         this.searchResults = null;
    //     }
    // }


    deleteFriend(friendId, FbId, indexToDelete) {
        console.log(friendId)
        console.log(FbId)
        this.httpService.put(apiUrls.userFriends + this.myId + '/remove-friend', {
            friend_id: friendId,
            fb_id: FbId
        }).subscribe(data => {
            console.log('result after set', data)
            this.userFriends.splice(indexToDelete, 1)
            localStorage.setItem('userFriends', JSON.stringify(this.userFriends))
        }, error => {
            console.log('fail on delete group', error)
        })

    }

    loadData($event: any) {
        if ($event) {
            console.log('INFINITE SCROLL', $event)
            if (this.currentPage < this.totalPage) {
                console.log('yes')
                console.log(this.SearchFriend.value)
                this.httpService.get(apiUrls.searchUser + this.myId + '/search?term=' + this.SearchFriend.value + '&page=' + (this.currentPage + 1)).subscribe(data => {
                    this.currentPage = this.currentPage + 1
                    let searchListReturned = data.data.rows
                    this.searchResults = this.searchResults.concat(searchListReturned)
                    $event.target.complete();

                }, error => {
                    $event.target.complete();
                    console.log('error in query api', error)

                })

            } else {
                console.log('current page is larger than total pages', this.currentPage)
                $event.target.complete();

            }
        }

    }

    Invite() {
        this.socialSharing.share('Share your app link', 'Invitation', null, this.url).then(() => {
            // Success!
        }).catch(() => {
            // Error!
        });
    }

    // HandleCancel(e: any) {
    //     if (e.cancelable) {
    //         e.preventDefault();
    //     }
    // }
    checkName(name: any) {
        return name[0]
    }
}


