import {Component, OnInit} from '@angular/core';
import {apiUrls} from "../../../environments/apis/api.urls";
import {HttpService} from "../../../shared/services/http.service";
import {ModalController, ToastController} from "@ionic/angular";
import {globalToast} from "../../../shared/classes/globalToast";

@Component({
    selector: 'app-turn-all-bulb-modal',
    templateUrl: './turn-all-bulb-modal.component.html',
    styleUrls: ['./turn-all-bulb-modal.component.scss'],
})
export class TurnAllBulbModalComponent implements OnInit {
    myId;

    constructor(private httpService: HttpService,
                private modalCtrl: ModalController,
                private toastCtrl: ToastController,
                private globalToast: globalToast) {
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.myId = JSON.parse(localStorage.getItem('userData'))._id

    }

    turnOnAnonymous() {
        this.httpService.post(apiUrls.Bulb + this.myId + '/' + 'all-groups', {
            is_anonymous: true,
            bulb_action: true
        }).subscribe(data => {
            if (data.isSuccess == true) {
                this.modalCtrl.dismiss(true)
            } else {
                console.log('bulbs can not be turned ON')
                let message = 'bulbs can not be turned ON'
                // this.presentToast(message)
                this.globalToast.presentToast(message)
                this.modalCtrl.dismiss(true)
            }
        }, error => {
            this.globalToast.presentToast(error.name)
            this.modalCtrl.dismiss(true)

            console.log(error)
        });
    }

    turnOff() {
        this.httpService.post(apiUrls.Bulb + this.myId + '/' + 'all-groups', {
            is_anonymous: true,
            bulb_action: false
        }).subscribe(data => {
            if (data.isSuccess == true) {
                this.modalCtrl.dismiss(true)
            } else {
                let message = 'bulbs can not be turned OFF'
                this.globalToast.presentToast(message)
                this.modalCtrl.dismiss(true)

                console.log('ERRRRRRRRRRRRROR')
            }
        }, error => {
            // this.errorToast(error.name)
            this.globalToast.presentToast(error.name)

            this.modalCtrl.dismiss(true)

            console.log(error)
        });
    }

    turnOnByUser() {
        this.httpService.post(apiUrls.Bulb + this.myId + '/' + 'all-groups', {
            is_anonymous: false,
            bulb_action: true
        }).subscribe(data => {
            if (data.isSuccess == true) {
                this.modalCtrl.dismiss(true)
            } else {
                console.log('bulbs can not be turned ON')
                let message = 'bulbs can not be turned ON'
                // this.presentToast(message)
                this.globalToast.presentToast(message)

                this.modalCtrl.dismiss(true)
            }
        }, error => {
            // this.errorToast(error.name)
            this.globalToast.presentToast(error.name)

            this.modalCtrl.dismiss(true)

            console.log(error)
        });
    }

    dismiss() {

        this.modalCtrl.dismiss(false)

    }

    moveBack() {
        this.dismiss()
    }

    async presentToast(message) {
        const toast = await this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top'
        });

        await toast.present();
    }

    async errorToast(message) {
        const toast = await this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top'
        });

        await toast.present();
    }

    cancel() {
        this.dismiss()
    }
}
