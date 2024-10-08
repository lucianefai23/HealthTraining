import { Injectable } from '@angular/core';
import { Product } from '../../domain/model/product.model';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductReadService {

  constructor(private http: HttpClient) { }

  findById(id: string): Promise<Product> {
    return firstValueFrom(this.http.get<Product>(`http://localhost:3000/product/${id}`));
  }

  findByName(name: string): Promise<Product[]> {
    return firstValueFrom(this.http.get<Product[]>(`http://localhost:3000/product?name=${name}`));
  }

  findAll(): Promise<Product[]> {
    return firstValueFrom(this.http.get<Product[]>(`http://localhost:3000/product`));
  }
}
