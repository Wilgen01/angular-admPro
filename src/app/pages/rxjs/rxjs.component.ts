import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription, of} from 'rxjs';
import { filter, map, retry, take } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnInit, OnDestroy {

  intervalDesub : Subscription = of().subscribe();

  constructor() { 
    // this.retornaObservable().pipe(
    //   retry()
    // ).subscribe(
    // data=>console.log(data),
    // error =>console.warn('error'),
    // () => console.info('Terminooo!')
    // );

    this.intervalDesub =  this.retornaIntervalo()
    .subscribe(console.log)
  }
  ngOnDestroy(): void {
    this.intervalDesub.unsubscribe()
  }


  ngOnInit(): void {

  }

  retornaIntervalo(){
    return interval(1000)
    .pipe(
      map(valor=> valor+1),
      filter(valor =>(valor % 2 === 0)? true : false)
    )
    
  }


  retornaObservable(){
    let i = -1
    const obs$ = new Observable<number>(observer =>{
      let intervalo = setInterval(()=>{
        i++
        observer.next(i)
        if (i === 4) {
          clearInterval(intervalo)
          observer.complete();
        }
      },1000)
    })

    return obs$
  }

}
