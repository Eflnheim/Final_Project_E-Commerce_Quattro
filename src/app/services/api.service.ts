import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  public getListProducts() {
    return this.http.get<any>(environment.url_domain + "/api/products", {})
  } //

  public getProductById(id: number) {
    return this.http.get<any>(`${environment.url_domain}/api/products/${id}`, {});
  }

  public createTransaction(order: any) {
    return this.http.post<any>(environment.url_domain + "/api/order", order);
  }

  public getUserOrder(id : number) {
    return this.http.get<any>(`${environment.url_domain}/api/order/${id}`, {});
  }
}
