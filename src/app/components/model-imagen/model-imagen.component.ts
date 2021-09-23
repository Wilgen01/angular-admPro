import { Component, OnInit } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { Usuario } from '../../models/usuario.model';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-model-imagen',
  templateUrl: './model-imagen.component.html',
  styles: [
  ]
})
export class ModelImagenComponent implements OnInit {
  public imagenPerfil!: File;
  public imgTemp : any;

  constructor(public modalImagenService: ModalImagenService,
              private fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal(){
    this.modalImagenService.cerrarModal()
    this.imgTemp = null;
  }

  cambiarImagen(event: any){
    const file = event.files[0];
    this.imagenPerfil = file
    if (!file) {
      this.imgTemp = null
      return
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () =>{
      this.imgTemp = reader.result
    }
  }

  subirImagen(){
    console.log('esta');
    
    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo
    console.log('aun esta');
    this.fileUploadService.actualizarFoto(this.imagenPerfil, tipo, id)
    .then(img =>{
      Swal.fire('Guardado', 'Imagen de perfil editada con exito', 'success')
      this.modalImagenService.nuevaImagen.emit(img)
      this.cerrarModal()
    }).catch(error =>{
      Swal.fire('Error', 'Error cargando la imagen', 'error')
    })
  }
}
