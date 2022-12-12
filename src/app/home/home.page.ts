
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { GooglemapsComponent } from '../googlemaps/googlemaps.component';
import { AuthService } from '../services/auth.service';
import { AvatarService } from '../services/avatar.service';
import { ChatService } from '../services/chat.service';
import { FirestoreService } from '../services/firestore.service';
import { InteractionService } from '../services/interaction.service';
import { Datos } from './models/models';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  profile = null;

  datos: Datos[] = [];
  data: Datos = {

    informacionUsuario: {
      nombre: 'miguel Cuenca',
      cedula: '1724518087',
      telefono: 983873954
    },
    informacionCensado: {
      nombre: '',
      cedula: '',
      miembros: null,
      fotos: '',
      ubicacion: null,
      id: ''
    }

  }
  newFile: any;

  constructor(
    private chatService: ChatService,
    private avatarService: AvatarService,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private firestore: FirestoreService,
    private interaction: InteractionService,
    private modalController: ModalController
  ) {
    this.avatarService.getUserProfile().subscribe((data) => {
      this.profile = data;
    });
  }

  ngOnInit() {
    console.log('dr crep la visra');
    this.getDatos();

  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }



  // sendMessage() {
  //   this.chatService.addChatMessage(this.newMsg).then(() => {
  //     this.newMsg = '';
  //     this.content.scrollToBottom();
  //   });
  // }

  signOut() {
    this.authService.logout().then(() => {
      this.router.navigateByUrl('/', { replaceUrl: true });
    });
  }

  async changeImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos, // Camera, Photos or Prompt!
    });

    if (image) {
      const loading = await this.loadingController.create();
      await loading.present();

      const result = await this.avatarService.uploadImage(image);
      loading.dismiss();

      if (!result) {
        const alert = await this.alertController.create({
          header: 'Upload failed',
          message: 'There was a problem uploading your avatar.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }

  // getEstudiantes() {
  //   this.firestore.getCollection();
  // }

  crearNuevoResultado() {

    this.interaction.showLoading('Guardando ...')
    // const datos: Datos = {
    //   informacionUsuario: {
    //     nombre: 'miguel Cuenca',
    //     cedula: '1724518087',
    //     telefono: 983873954
    //   },
    //   informacionCensado: {
    //     nombre: 'jorge ulloa',
    //     cedula: '1234567894',
    //     miembros: 3,
    //     fotos: 'https://concepto.de/wp-content/uploads/2015/08/familia-extensa-e1591818033557.jpg',
    //     geolocalizacion: '-0.1615789,-78.4845747,19z',
    //   }
    // }
    const path = 'users';
    const id = this.firestore.getId();
    this.data.informacionCensado.id = id;
    this.firestore.createDoc(this.data, path, id).then((res) => {
      console.log('guardado conexito');
      this.interaction.closeLoading();
      this.interaction.presentToast('Guardado con exito')

    })
  }

  getDatos() {
    this.firestore.getCollection<Datos>('users').subscribe(res => {
      console.log('la lectura', res);
      this.datos = res;

    })
  }



  async newImageUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) => {
        this.data.informacionCensado.fotos = image.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  async addDirection() {

    const ubicacion = this.data.informacionCensado.ubicacion;
    let positionInput = {
      lat: 0,
      lng: 0,
    };
    if (ubicacion !== null) {
      positionInput = ubicacion;
    }

    const modalAdd = await this.modalController.create({
      component: GooglemapsComponent,
      mode: 'ios',
      swipeToClose: true,
      componentProps: { position: positionInput }
    });
    await modalAdd.present();

    const { data } = await modalAdd.onWillDismiss();
    if (data) {
      console.log('data -> ', data);
      this.data.informacionCensado.ubicacion = data.pos;
      console.log('this.cliente -> ', this.data.informacionCensado);
    }

  }

}
