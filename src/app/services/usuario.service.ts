import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { tap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuarios } from '../interfaces/cargar-usuarios.interface';
import Swal from 'sweetalert2';
declare var gapi: any; 

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2 : any;
  public usuario : Usuario = new Usuario('','')

  constructor(private http: HttpClient, 
              private router : Router, 
              private ngZone : NgZone) { 
                
    this.googleInit();
  }

  get token(){
    return localStorage.getItem('token') || '';
  }

  get uid(){
    return this.usuario.uid || ''
  }

  get headers(){
    return {
      headers: {
        'x-token' : this.token
      }
    }
  }

  
  googleInit(){
    return new Promise(resolve =>{
      gapi.load('auth2', () =>{
        this.auth2 = gapi.auth2.init({
          client_id: '959700034992-op2qkfdl0r15vaam3e50qc2var9lqtlt.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve(true);
      });
    })
  }

  logout(){
    localStorage.removeItem('token');
    
    this.auth2.signOut().then( () => {
      this.ngZone.run(()=>{
        this.router.navigateByUrl('/login')
      })
    });
    
  }

  validarToken(){

    return this.http.get(`${base_url}/login/renew`,{
      headers: {
        'x-token' : this.token
      }
    }).pipe(
      map((resp: any) =>{
        const {
          nombre,
          email,
          img,
          google,
          rol,
          uid,
        } = resp.usuario
        this.usuario = new Usuario(nombre, email, '', img, google, rol, uid)      
        localStorage.setItem('token', resp.token)
        return true
      }),
      catchError(err => of(false))
    )
  }

  crearUsuario(formData: RegisterForm){
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap((resp:any) =>{
        localStorage.setItem('token', resp.token)
      })
    )
  }

  actualizarPerfil(data: {email:String, nombre: string, rol: string}){
    data = {
      ...data, 
      rol: this.usuario.rol || ''
    }
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers)
  }

  login(formData: LoginForm){
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp : any)=>{
        localStorage.setItem('token', resp.token)
        return resp
      })
    )
  }

  loginGoogle(token: string){
    return this.http.post(`${base_url}/login/google`, {token}).pipe(
      tap((resp : any)=>{
        localStorage.setItem('token', resp.token)
        return resp
      })
    )
  }

  cargarUsuarios(desde = 0){
    return this.http.get<CargarUsuarios>(`${base_url}/usuarios?desde=${desde}`, this.headers)
                    .pipe(
                      map(resp =>{
                        const usuarios = resp.usuarios.map(
                          user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.rol, user.uid)
                        );
                        return {
                          total: resp.total,
                          usuarios
                        }
                      })
                    )
  }

  eliminarUsuario(usuario : Usuario){
    return this.http.delete(`${base_url}/usuarios/${usuario.uid}`, this.headers)
  }

  guardarUsuario(data:Usuario){
    return this.http.put(`${base_url}/usuarios/${data.uid}`, data, this.headers)
  }

}
