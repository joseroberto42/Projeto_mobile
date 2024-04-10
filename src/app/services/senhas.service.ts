import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SenhasService {

  constructor() { }
  public senhasGeral: number = 0;
  public senhasPrior: number = 0;
  public senhasExame: number = 0;
  public senhasTotal: number = 0;

  // Array para armazenar as senhas emitidas
  senhasEmitidas: Senha[] = [];
  senhaChamada: Senha | null = null;
  // Métodos para incrementar os contadores de senhas
  somaGeral() { this.senhasGeral++; this.senhasTotal++; };
  somaPrior() { this.senhasPrior++; this.senhasTotal++; };
  somaExame() { this.senhasExame++; this.senhasTotal++; };

  // Método para chamar uma senha
  chamarSenha() {
    // Verifica se há senhas prioritárias na lista
    const senhaPrioritaria = this.senhasEmitidas.find(senha => senha.numero.startsWith('PR'));
    if (senhaPrioritaria) {
      this.chamarEAtualizarSenha(senhaPrioritaria);
      return;
    }

    // Senão, verifica se há senhas de exame na lista
    const senhaExame = this.senhasEmitidas.find(senha => senha.numero.startsWith('EX'));
    if (senhaExame) {
      this.chamarEAtualizarSenha(senhaExame);
      return;
    }

    // Se não houver senhas prioritárias ou de exame, chama a próxima senha geral
    const proximaSenhaGeral = this.senhasEmitidas.find(senha => senha.numero.startsWith('GE'));
    if (proximaSenhaGeral) {
      this.chamarEAtualizarSenha(proximaSenhaGeral);
      return;
    }

    console.log('Não há mais senhas para chamar.');
  }

  // Método para chamar e atualizar a senha chamada
  private chamarEAtualizarSenha(senha: Senha) {
    console.log('Chamando senha:', senha);
    senha.dataHoraAtendimento = new Date(); // Define a hora de atendimento
    this.senhaChamada = senha; // Atualiza a senha chamada
    const index = this.senhasEmitidas.indexOf(senha);
    if (index !== -1) {
      this.senhasEmitidas.splice(index, 1);
    }
  }

  // Método para criar uma senha prioritária
  criarSenhaPrioritaria(): void {
    const senhaPrioritaria: Senha = this.criarSenha('PR');
    this.senhasEmitidas.push(senhaPrioritaria);
    console.log(senhaPrioritaria);
  }

  // Método para criar uma senha geral
  criarSenhaGeral(): void {
    const senhaGeral: Senha = this.criarSenha('GE');
    this.senhasEmitidas.push(senhaGeral);
    console.log(senhaGeral);
  }

  // Método para criar uma senha de exame
  criarSenhaExame(): void {
    const senhaExame: Senha = this.criarSenha('EX');
    this.senhasEmitidas.push(senhaExame);
    console.log(senhaExame);
  }

  private sequenciaGeral: number = 0;
  private sequenciaPrior: number = 0;
  private sequenciaExame: number = 0;

  private criarSenha(tipo: string): Senha {
    const dataHora = new Date(); // Obtém a data e a hora atuais
    const ano = dataHora.getFullYear().toString().slice(-2);
    const mes = ('0' + (dataHora.getMonth() + 1)).slice(-2);
    const dia = ('0' + dataHora.getDate()).slice(-2);
  
    let sequencia: number;
    if (tipo === 'GE') {
      this.sequenciaGeral++;
      sequencia = this.sequenciaGeral;
      this.senhasGeral++; this.senhasTotal++
    } else if (tipo === 'PR') {
      this.sequenciaPrior++;
      sequencia = this.sequenciaPrior;
      this.senhasPrior++; this.senhasTotal++
      
    } else if (tipo === 'EX') {
      this.sequenciaExame++;
      sequencia = this.sequenciaExame;
      this.senhasExame++; this.senhasTotal++; 
    } else {
      sequencia = 1; // Se não for nenhum tipo específico, a sequência é 1
    }
  
    const sequenciaFormatada = ('00' + sequencia).slice(-2);
    const senha = `${ano}${mes}${dia}-${tipo}${sequenciaFormatada}`;
  
    return { numero: senha, dataHora: dataHora };
  }
}

// Interface para representar uma senha
interface Senha {
  numero: string;
  dataHora: Date;
  dataHoraAtendimento?: Date; // Propriedade opcional para a hora de atendimento
}
