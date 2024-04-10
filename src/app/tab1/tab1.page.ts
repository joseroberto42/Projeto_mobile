import { Component } from '@angular/core';
import { SenhasService } from '../services/senhas.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor( public senhasService: SenhasService) {


  }
  inputNovaSenha: string = '';
  criarSenhaPrioritaria(): void {
    this.senhasService.criarSenhaPrioritaria();
  }

  criarSenhaGeral(): void {
    this.senhasService.criarSenhaGeral();
  }

  criarSenhaExame(): void {
    this.senhasService.criarSenhaExame();
  }
}
