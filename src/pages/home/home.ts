import {Component,ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Http} from '@angular/http'
import {DbProvider, Job} from '../../providers/db/db';
import {LoadingController, ToastController,Content} from 'ionic-angular';
// import {ImageLazyLoadModule, WebWorkerService} from 'ng2-image-lazy-load';

// WebWorkerService.workerUrl = 'assets/js/xhrWorker.js';
// WebWorkerService.enabled = true;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  jobs: Array<Job>;
  page: number;
  count: number;

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, private http: Http, private db: DbProvider, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
    this.jobs = [];
    this.page = 0;


    this.db.countAll().then((r) => {
      this.count = r;
      this.loadJobs(null);
    }).catch((error) => {
    });
  }

  loadJobs(ev) {
    this.page++;
    if (this.page <= Math.round(this.count / 10)) {

      let loader = this.loadingCtrl.create({
        content: "Carregando Jobs..."
      });
      loader.present();
      this.db.getAllByPage(this.page).then((resp) => {
        this.jobs=this.jobs.concat(resp);
        console.log(this.jobs);
        if (ev != null) {
          ev.complete();
        }
        loader.dismiss();
        let toast = this.toastCtrl.create({
          message: 'Jobs carregados com sucesso',
          duration: 1000
        });
        toast.present();
        // this.content.scrollTo(0, Math.floor(this.content.scrollHeight/3), 1);
      })

    }
  }

  getItems(ev) {

  }

  detail(j) {

  }

  convert(timestamp) {
    let date = new Date(timestamp * 1000),
      datevalues = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
      ];
    return datevalues[2] + "/" + datevalues[1] + "/" + datevalues[0] + " - " + datevalues[3] + ":" + datevalues[4] + ":" + datevalues[5];
  }

  splitText(text) {
    return text.slice(0, 200).replace(/<br\s*\/?>/gi, ' ').concat("...");
  }


}
