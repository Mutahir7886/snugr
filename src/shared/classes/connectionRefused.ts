import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import { Network } from '@ionic-native/network/ngx';

import {Router} from '@angular/router';
import {ToastController} from "@ionic/angular";
import {globalToast} from "./globalToast";

@Injectable({
    providedIn: 'root'
})export class connectionRefused  {
    constructor(public router: Router,
                private toastCtrl: ToastController,
                private network: Network,
                private globalToast:globalToast
    ) {


    }

    initiateNetwork(){
        this.network.onConnect().subscribe(() => {
            console.log('network connected!');
            // We just got a connection but we need to wait briefly
            // before we determine the connection type. Might need to wait.
            // prior to doing any api requests as well.
            setTimeout(() => {
                if (this.network.type === 'wifi') {
                    console.log('we got a wifi connection, woohoo!');
                    // this.globalToast.presentToast('Connection Successful')
                    // location.reload()

                }
            }, 3000);
        });

        this.network.onDisconnect().subscribe(() => {
            this.globalToast.presentToast('Internet Connection Error')
            console.log('network was disconnected :-(');
        });
    }

// stop disconnect watch



// watch network for a connection


// stop connect watch


}

