import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu : any  [] = [{
    titulo: 'Dashboard!',
    icono: 'mdi mdi-gauge',
    submenu: [
      {titulo: 'Main', url: '/'},
      {titulo: 'ProgressBar', url: 'progress'},
      {titulo: 'Gráficas', url: 'grafica1'},
      {titulo: 'promesas', url: 'promesas'},
      {titulo: 'rxjs', url: 'rxjs'},
      
    ]
  }]

  constructor() { }
}
