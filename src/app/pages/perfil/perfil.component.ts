import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup = this.fb.group({});  
  public usuario : Usuario = new Usuario('', '')
  public imagenPerfil!: File;
  public imgTemp : any;

  constructor(private fb : FormBuilder,
              private usuarioService : UsuarioService,
              private fileUploadService: FileUploadService) { 
  this.usuario = usuarioService.usuario
}

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre,[ Validators.required]],
      email: [this.usuario.email,[ Validators.required, Validators.email]]
    })
  }

  actualizarPerfil(){
    console.log(this.perfilForm.value);
    this.usuarioService.actualizarPerfil(this.perfilForm.value).subscribe((resp : any)=>{
      this.usuario.nombre = resp.usuario.nombre
      this.usuario.email = resp.usuario.email
      Swal.fire({
        title: 'Guardado', 
        text: 'perfil editado con exito',
        icon: 'success'
      })
    },(error) =>{
      Swal.fire('Error', error.error.msg, 'error')
    })
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
    if (!this.usuario.uid) {
      return
    }
    this.fileUploadService.actualizarFoto(this.imagenPerfil, 'usuarios', this.usuario.uid)
    .then(img =>{
      this.usuario.img = img
      Swal.fire('Guardado', 'Imagen de perfil editada con exito', 'success')
    }).catch(error =>{
      Swal.fire('Error', 'Error cargando la imagen', 'error')
    })
  }

}
