import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import Dexie from 'dexie';

export interface Job {
  slug: string;
  id: number;
  epoch:number;
  date:string;
  company:string;
  position:string;
  tags:Array<string>;
  logo:string;
  description:string;
  url:string
}
@Injectable()
export class DbProvider extends Dexie{

  model:Dexie.Table<Job, number>;

  constructor(public http: Http) {
    super('remoteok')
    this.version(1).stores({
      remoteok: '++id,slug,epoch,date,company,position,tags,logo,description,url'
    });
    this.model = this.table('remoteok');
  }

  getAll() {
    return this.model.toArray();
  }

  getAllByPage(i:number) {
    return this.model.orderBy("date").offset(10+i).limit(10).reverse().toArray();
  }

  countAll(){
    return this.model.count();
  }

  getAllSort(key:string){
    return this.model.orderBy(key).toArray();
  }

  add(data) {
    return this.model.add(data);
  }

  update(id, data) {
    return this.model.update(id, data);
  }

  remove(id) {
    return this.model.delete(id);
  }

  newIntance(){
    this.getAll().then((resp)=>{
      if(resp.length==0){
        this.http.get('../assets/remotejobs.json').subscribe(res => {
          let jobs = JSON.parse(res['_body'])
          for(let j in jobs){
            jobs[j]['date']=(new Date(jobs[j]['date'])).getTime() / 1000
            this.add(jobs[j]);
          }
        });
      }
    })
  }

}
