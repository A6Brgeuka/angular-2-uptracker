import { Component, OnInit } from '@angular/core';

import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { ModalWindowService } from '../../core/services/modal-window.service';
import { ReportsFilterModal } from './reports-filter-modal/reports-filter-modal.component';

declare var AmCharts: any;

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
@DestroySubscribers()
export class ReportsComponent implements OnInit {

  chart: any
  chartData: Array<any>;

  constructor(
    public modal: Modal,
    public modalWindowService: ModalWindowService
  ) {
  }
  
  ngOnInit() {
    this.chartData = this.generatechartData();

    this.chart = AmCharts.makeChart("chartdiv", {
      theme: "light",
      type: "serial",
      marginRight: 80,
      autoMarginOffset: 20,
      marginTop: 20,
      dataProvider: this.chartData,
      valueAxes: [{
        id: "v1",
        axisAlpha: 0.1
      }, {
        id: "v2",
        axisAlpha: 0.1,
      }],
      graphs: [{
        id: "g1",
        useNegativeColorIfDown: false,
        balloonText: "[[category]]<br><b>value: [[value]]</b>",
        bullet: "round",
        bulletBorderAlpha: 1,
        bulletBorderColor: "#ffffff",
        hideBulletsCount: 50,
        lineThickness: 2,
        lineColor: "#32da81",
        valueField: "visits"
      }, {
        id: "g2",
        useNegativeColorIfDown: false,
        balloonText: "[[category]]<br><b>value: [[value]]</b>",
        bullet: "round",
        bulletBorderAlpha: 1,
        bulletBorderColor: "#ffffff",
        dashLength: 10,
        hideBulletsCount: 50,
        lineThickness: 2,
        lineColor: "#9a9c9e",
        showBalloon: false,
        valueField: "hits"
      }],
      chartScrollbar: {
        scrollbarHeight: 5,
        backgroundAlpha: 0.1,
        backgroundColor: "#868686",
        selectedBackgroundColor: "#67b7dc",
        selectedBackgroundAlpha: 1
      },
      chartCursor: {
        valueLineEnabled: true,
        valueLineBalloonEnabled: true
      },
      categoryField: "date",
      categoryAxis: {
        parseDates: true,
        axisAlpha: 0,
        minHorizontalGap: 60
      },
      balloon: {
        fillColor: "#32da81"
      },
      export: {
        enabled: true
      }
    });

    this.chart.addListener("dataUpdated", this.zoomChart);
  }

  generatechartData() {
    var _chartData = [];
    var firstDate = new Date();
    firstDate.setDate(firstDate.getDate() - 10);
    var visits = 500;
    var hits = 300;

    for (var i = 0; i < 10; i++) {
      // we create date objects here. In your data, you can have date strings
      // and then set format of your dates using chart.dataDateFormat property,
      // however when possible, use date objects, as this will speed up chart rendering.
      var newDate = new Date(firstDate);
      newDate.setDate(newDate.getDate() + i);

      visits += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);
      hits += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);

      _chartData.push({
        date: newDate,
        visits: visits,
        hits: hits,
      });
    }

    return _chartData;
  }

  zoomChart() {
    if (this.chart.zoomToIndexes) {
      this.chart.zoomToIndexes(130, this.chartData.length - 1);
    }
  }

  showFiltersModal() {
    this.modal
    .open(ReportsFilterModal, this.modalWindowService.overlayConfigFactoryWithParams({}))
    .then((resultPromise) => {
      resultPromise.result.then(
        (res) => {
          // this.filterProducts();
        },
        (err) => {
        }
      );
    });
  }
}
