import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  loading: any;

  constructor(public toastController: ToastController,
    public loadingCtrl: LoadingController) { }

  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
    });
    toast.present();

  }

  async showLoading(mensaje: string) {
    this.loading = await this.loadingCtrl.create({
      message: mensaje,
      cssClass: 'my-custom-class',
    });

    await this.loading.present();
  }

  async closeLoading() {

    await this.loading.dismiss();
  }
}
