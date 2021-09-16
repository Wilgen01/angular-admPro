import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { tap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
declare var gapi: any; 

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2 : any;

  constructor(private http: HttpClient, 
              private router : Router, 
              private ngZone : NgZone) { 
                
    this.googleInit();
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
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/renew`,{
      headers: {
        'x-token' : token
      }
    }).pipe(
      tap((resp: any) =>{
        localStorage.setItem('token', resp.token)
      }),
      map(resp=> true),
      catchError(err => of(false))
    )
  }

  crearUsuario(formData: RegisterForm){
    return this.http.post(`${base_url}/usuarios`, formData)
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
}
