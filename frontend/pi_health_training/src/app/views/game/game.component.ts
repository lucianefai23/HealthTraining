import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  jogo!: Game;
  board: { question: string }[] = [];
  currentPosition: number = 0;
  diceValue: number | null = null;
  markerPosition = 'translate(0px, 0px)';
  diceRotation = 0;
  colors: string[] = [];
  currentQuestion: { question: string, answer: boolean } | null = null;
  isQuestionAnswered: boolean = false;

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.carregar_jogo();
    this.initializeBoard();
    this.generateRandomColors();
  }

  carregar_jogo() {
    const id = this.router.url.split('/')[2];

    this.http.get<Game>(`http://localhost:3000/game/${id}`).subscribe({
      next: value => {
        this.jogo = value;
        if (!this.jogo) {
          this.toastr.error('Dados do jogo não encontrados');
        }
      },
      error: error => {
        this.toastr.error('Erro ao carregar o jogo');
      }
    });
  }

  initializeBoard() {
    const totalCells = 20;
    this.board = Array.from({ length: totalCells }, (_, i) => {
      const rowIndex = Math.floor(i / 5);
      const isEvenRow = rowIndex % 2 === 1;
      const adjustedIndex = isEvenRow 
          ? (rowIndex + 1) * 5 - (i % 5) - 1
          : i;

      return {
        question: `Pergunta ${adjustedIndex + 1}`
      };
    });
  }

  rollDice() {
    this.diceValue = Math.floor(Math.random() * 6) + 1;
    this.animateDice();

    // Exibir uma nova pergunta para o jogador responder
    this.currentQuestion = this.getRandomQuestion();
    this.isQuestionAnswered = false;
  }

  animateDice() {
    const diceElement = document.querySelector('.dice') as HTMLElement;
    if (diceElement) {
      this.diceRotation += 360; // Incrementa a rotação a cada clique
      diceElement.style.transform = `rotate(${this.diceRotation}deg)`;
    }
  }

  movePlayer(roll: number) {
    // Move o jogador para a nova posição
    const newPosition = Math.min(this.currentPosition + roll, this.board.length - 1);
    this.currentPosition = newPosition;
    
    // Atualiza a posição do marcador
    const position = this.getPosition(this.currentPosition);
    this.markerPosition = `translate(${position.x}px, ${position.y}px)`;
  }

  getPosition(index: number) {
    const row = Math.floor(index / 5);
    const col = index % 5;
    return {
      x: col * 160 + 15,
      y: row * 160 + 15
    };
  }

  getItemStyle(i: number): string {
    return this.colors[i];
  }

  generateRandomColors() {
    this.colors = this.board.map(() => this.getRandomColor());
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getRandomQuestion(): { question: string, answer: boolean } {
    const questions = [
      { question: 'A Terra é plana?', answer: false },
      { question: 'O Sol é uma estrela?', answer: true },
      { question: 'A água ferve a 100°C?', answer: true },
      { question: 'O Brasil é um continente?', answer: false }
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  }

  answerQuestion(answer: boolean) {
    if (this.currentQuestion) {
      if (this.currentQuestion.answer === answer) {
        this.toastr.success('Resposta correta!');
        this.movePlayer(this.diceValue!);
      } else {
        this.toastr.error('Resposta incorreta. Tente novamente!');
      }
      this.isQuestionAnswered = true;
      this.currentQuestion = null; // Ocultar a pergunta após responder
    }
  }
}
