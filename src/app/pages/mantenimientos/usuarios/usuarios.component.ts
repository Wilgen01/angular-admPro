import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [ 
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy{

  public totalUsuarios = 0
  public usuarios : Usuario[] = []
  public usuariosTemp : Usuario[] = []

  public imgSubs: Subscription = new Subscription;
  public desde = 0
  public cargando =  true 

  constructor(private usuarioService : UsuarioService,
              private busquedasService : BusquedasService,
              private modalImagenService : ModalImagenService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe()
  }

  ngOnInit(): void {
    this.CargarUsuarios();
    this.imgSubs = this.modalImagenService.nuevaImagen.pipe(
      delay(100)
    ).subscribe(img=>this.CargarUsuarios())
  }

  CargarUsuarios(){
    this.cargando = true
    this.usuarioService.cargarUsuarios(this.desde)
    .subscribe(({total, usuarios}) =>{
      this.totalUsuarios = total
      this.usuarios = usuarios
      this.usuariosTemp = usuarios
      this.cargando = false
    })
  }

  cambiarPagina(valor : number){
    this.desde += valor
    
    
    if (this.desde < 0) {
      this.desde = 0
    }else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;      
    }
    this.CargarUsuarios();
  }

  buscar(termino: string){
    if (!termino) {
       this.usuarios = this.usuariosTemp
       return
    }
    this.busquedasService.buscar('usuarios', termino).subscribe(resultados=>{
      this.usuarios = resultados
    })
  }

  eliminarUsuario(usuario : Usuario){

    if (usuario.uid === this.usuarioService.uid) {
      Swal.fire('Error', 'No puedes eliminar tu mismo Usuarios', 'error')
      return 
    }
    console.log(usuario);
    Swal.fire({
      title: '¿Estas seguro?', 
      text: `Estas seguro que desea eliminar el usaurio ${usuario.nombre}`,
      icon: 'warning', 
      showConfirmButton: true,
      showCancelButton: true,
    }).then(resp=>{
      if (resp.value) {
        this.usuarioService.eliminarUsuario(usuario).subscribe(resp =>{
          this.CargarUsuarios();
          console.log(resp);
          Swal.fire('Usuario Borrado', `${usuario.nombre} ha sido eliminado`, 'success')
        })
      }     
    })
  }

  cambiarRol(usuario: Usuario){
    this.usuarioService.guardarUsuario(usuario).subscribe(resp=>{
      console.log(resp);
      
    })
  }

  abrirModal(usuario : Usuario){
    this.modalImagenService.abrirModal('usuarios', usuario.uid!, usuario.img)
  }

}
