import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy{
  titulo : string = '';
  public tituloSubs$: Subscription = new Subscription;

  constructor(private router: Router) { 
      this.tituloSubs$ = this.getParametros().subscribe(({titulo})=>{
        this.titulo = titulo
        document.title = `AdminPro  |  ${titulo}`        
      })
  }
  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe()
  }
  
  getParametros(){
    return this.router.events
    .pipe(
      filter(resp =>resp instanceof ActivationEnd && resp.snapshot.firstChild === null),
      map((resp: any) =>resp.snapshot.data)
    )
  }
 

}
