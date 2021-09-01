import { Component, OnInit, Input } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent implements OnInit {

  @Input() titulo : String = 'Sin Titulo';
  @Input('labels') doughnutChartLabels: Label[] = ['label1','label1','label1']
  @Input('data') doughnutChartData: MultiDataSet = [[1,1,1]]
  public doughnutChartType: ChartType = 'doughnut';

  public colors : Color[] = [
    {backgroundColor: ['#6857e6','#009fee','#f02059']}
  ]

  constructor() { }

  ngOnInit(): void {
  }

  
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

}
