import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
declare var gapi: any; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  public auth2 : any;
  public loginForm = this.fb.group({
    email: ['test100@gmail.com', [Validators.required, Validators.email] , ],
    password: ['123456', [Validators.required] , ],
    remember: [false]
  });

  constructor(private router : Router,
              private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private ngZone : NgZone) { }
  ngOnInit(): void {
    this.renderButton()
  }

  
  login(){
    this.usuarioService.login(this.loginForm.value)
      .subscribe(res=>{
        this.router.navigate(['/'])
      }, (err)=>{       
        Swal.fire({
          title: 'Error!!',
          icon: 'error',
          text: err.error.msg,
        })
      })
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });
    this.startApp()
  }

  async startApp() {
    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;
    // gapi.load('auth2', () =>{
    //   this.auth2 = gapi.auth2.init({
    //     client_id: '959700034992-op2qkfdl0r15vaam3e50qc2var9lqtlt.apps.googleusercontent.com',
    //     cookiepolicy: 'single_host_origin',
    //   });
    // });
    this.attachSignin(document.getElementById('my-signin2'));
  }

  attachSignin(element: any ) {
    this.auth2.attachClickHandler(element, {},
        (googleUser : any ) =>{
          const id_token = googleUser.getAuthResponse().id_token;
          this.usuarioService.loginGoogle(id_token).subscribe(resp =>{
            this.ngZone.run(()=>{
              this.router.navigateByUrl('/')
            })
          })
          
        }, (error: any) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

}
