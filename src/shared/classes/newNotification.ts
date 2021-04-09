import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {Router} from '@angular/router';
import {ToastController} from "@ionic/angular";

@Injectable({
    providedIn: 'root'

})
export class newNotification  {
    newNotification = new Subject();
    // newNotificationObservable = this.newNotification.asObservable();

    constructor(public router: Router,
                private toastCtrl: ToastController
    ) {

    }
    // getNewNotificationObservable(): Observable<any> {
    //     return this.newNotificationObservable;
    // }
}

