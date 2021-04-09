import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {map} from "rxjs/operators";
import {newNotification} from "../../shared/classes/newNotification";
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, RouterStateSnapshot} from "@angular/router";
import {Tab2Page} from "../tab2/tab2.page";
import {Tab4Page} from "../tab4/tab4.page";

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {
    @ViewChild('tabGroups') tabs;

    showNewNotification: boolean = false;
    myUserId;
    routerEvent;
    tab2: Tab2Page;
    tab4: Tab4Page;
    selected = '';
    selectedTab4 = '';

    constructor(private newNotification: newNotification,
                private changeDetection: ChangeDetectorRef,
                private db: AngularFireDatabase, private router: Router) {

        console.log(this.router.url)

        this.routerEvent = router.events.subscribe((val) => {
            // see also
            if (val instanceof NavigationEnd) {
                console.log(val);
                if (val.url == '/alltabs/tabs/tab2;refresh=true') {
                    console.log('NEW CHANGE');
                    // this.tabs.select('tab2')
                    this.selected = 'tab2';
                } else if (val.url == '/alltabs/tabs/tab4;refresh=true') {
                    console.log('tab4 router EVENT')
                    setTimeout(va=>{
                        this.selected= 'tab4';
                    },200)
                    console.log('this.selectedTab',this.selected)
                } else {
                    this.selected = '';
                }
                console.log('this.selectedTab mcheck',this.selected)
            }
        });
        if (JSON.parse(localStorage.getItem('userData'))) {
            this.myUserId = JSON.parse(localStorage.getItem('userData'))._id;
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
                    for (let item of res) {
                        if (item.type === 'child_added') {
                            this.newNotification.newNotification.next(true)
                            break;
                        }
                    }
                });

        }


        this.newNotification.newNotification
            .subscribe((val: boolean) => {
                console.log('subscribe', val)
                this.showNewNotification = val;
                this.changeDetection.detectChanges()
            });
        console.log('this.newnot', this.showNewNotification)
    }

    // ionViewWillUnload() {
    //     this.routerEvent.unsubscribe();
    // }ionViewWillLeave() {
    //     console.log('leaving tab page--Checking routerEvent Unsubscribe')
    //     this.routerEvent.unsubscribe();
    // }

}

