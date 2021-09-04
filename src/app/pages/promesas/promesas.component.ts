import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.getUsuario().then(usuarios =>{
      console.log(usuarios);
      
    })
    // const promesa = new Promise((resolve, reject) => {
    //   console.log(resolve);
      
    // })
  }

  getUsuario(){

    const promesa = new Promise((resolve, reject) => {
      fetch('https://reqres.in/api/users')
      .then(data=> data.json())
      .then(body => console.log(body.data));
    })

    return promesa

  }

}
