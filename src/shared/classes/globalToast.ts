import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {Router} from '@angular/router';
import {ToastController} from "@ionic/angular";

@Injectable()
export class globalToast  {
    constructor(public router: Router,
                private toastCtrl: ToastController
    ) {

    }
async presentToast(message) {
    const toast = await this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'top'
    });

    await toast.present();
}

    async notificationToast(message) {
        const toast = await this.toastCtrl.create({
            message: message,
            duration: 1500,
            position: 'top'
        });

        await toast.present();
    }
}

