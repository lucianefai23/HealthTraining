import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from '../../../domain/model/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router) { }
  
  usuario!: User;

  ngOnInit() {
    this.buscarDados();
  }

  async buscarDados() {
    const email = localStorage.getItem('email');
    const senha = localStorage.getItem('senha');

    return this.http.get<User[]>(`http://localhost:3000/user?email=${email}&senha=${senha}`).subscribe({
      next: value => {
        this.usuario = value[0];

      },
      error: error => {

      }
    });
  }

}
