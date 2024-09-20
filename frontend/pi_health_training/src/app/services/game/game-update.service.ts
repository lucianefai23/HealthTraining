import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Game } from '../../domain/model/game';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameUpdateService {

  constructor(private http: HttpClient) { }

  async update(game:Game){
    console.log(`atualizando o game...`);
    console.log(game);
    return await firstValueFrom(this.http.put(`http://localhost:3000/game/${game.id}`, game))
  }
}
