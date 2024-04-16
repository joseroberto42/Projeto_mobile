import { Component } from '@angular/core';
import { SenhasService} from '../services/senhas.service';
import {RelatorioAtendimento} from '../services/senhas.service'
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(public senhasService: SenhasService) {this.relatorio = { senhas: [], temposMedios: {} };}
  relatorio: RelatorioAtendimento = { senhas: [], temposMedios: {} };

  
  gerarRelatorio() {
    this.relatorio = this.senhasService.gerarRelatorio();
    console.log(this.relatorio); 
  }
  
}