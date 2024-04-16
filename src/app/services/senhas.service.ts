import { Injectable } from '@angular/core';
interface SenhaAtendida {
  senha: Senha;
  tempoDecorrido: number; 
}


export interface RelatorioAtendimento {
  senhas: SenhaAtendida[];
  temposMedios: { [tipo: string]: number }; 
}
@Injectable({
  providedIn: 'root'
})
export class SenhasService {

  constructor() { }
  public senhasGeral: number = 0;
  public senhasPrior: number = 0;
  public senhasExame: number = 0;
  public senhasTotal: number = 0;

 
  senhasEmitidas: Senha[] = [];
  senhaChamada: Senha | null = null;
  senhasChamadas: Senha[] = [];
  senhasAtendidas: SenhaAtendida[] = []; 
  
  somaGeral() { this.senhasGeral++; this.senhasTotal++; };
  somaPrior() { this.senhasPrior++; this.senhasTotal++; };
  somaExame() { this.senhasExame++; this.senhasTotal++; };


  chamarSenha() {
  
    const senhaPrioritaria = this.senhasEmitidas.find(senha => {
        const substr = senha.numero.substring(7, 9);
        return substr === 'PR';
    });
    if (senhaPrioritaria) {
        console.log('Senha prioritária encontrada:', senhaPrioritaria);
        this.chamarEAtualizarSenha(senhaPrioritaria);
        return;
    }

    const senhaExame = this.senhasEmitidas.find(senha => {
        const substr = senha.numero.substring(7, 9);
        return substr === 'EX';
    });
    if (senhaExame) {
        console.log('Senha de exame encontrada:', senhaExame);
        this.chamarEAtualizarSenha(senhaExame);
        return;
    }

    //
    const proximaSenhaGeral = this.senhasEmitidas.find(senha => {
        const substr = senha.numero.substring(7, 9); 
        return substr === 'GE';
    });
    if (proximaSenhaGeral) {
        console.log('Próxima senha geral encontrada:', proximaSenhaGeral);
        this.chamarEAtualizarSenha(proximaSenhaGeral);
        return;
    }

    console.log('Não há mais senhas para chamar.');
  }

  private chamarEAtualizarSenha(senha: Senha) {
    console.log('Chamando senha:', senha);
    const tempoInicio = senha.dataHora; 
    const tempoFim = new Date(); 
    senha.dataHoraAtendimento = tempoFim;
    this.senhaChamada = senha;
    this.senhasChamadas.unshift(senha);

    const tempoDecorrido = (tempoFim.getTime() - tempoInicio.getTime()) / 60000; 
    this.senhasAtendidas.push({ senha, tempoDecorrido });

    const index = this.senhasEmitidas.indexOf(senha);
    if (index !== -1) {
      this.senhasEmitidas.splice(index, 1);
    }
  }

  
  criarSenhaPrioritaria(): void {
    const senhaPrioritaria: Senha = this.criarSenha('PR');
    this.senhasEmitidas.push(senhaPrioritaria);
    console.log(senhaPrioritaria);
    console.log(this.senhasEmitidas);
  }
  criarSenhaGeral(): void {
    const senhaGeral: Senha = this.criarSenha('GE');
    this.senhasEmitidas.push(senhaGeral);
    console.log(senhaGeral);
  }

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
      sequencia = 1; 
    }
  
    const sequenciaFormatada = ('00' + sequencia).slice(-2);
    const senha = `${ano}${mes}${dia}-${tipo}${sequenciaFormatada}`;
  
    return { numero: senha, dataHora: dataHora };
  }
  gerarRelatorio(): RelatorioAtendimento {
    const temposMedios: { [tipo: string]: number } = {};
    const senhas: SenhaAtendida[] = [];
    this.senhasAtendidas.forEach(senhaAtendida => {
      const tipo = senhaAtendida.senha.numero.substring(7, 9);
      if (!temposMedios[tipo]) {
        temposMedios[tipo] = 0;
      }
      temposMedios[tipo] += senhaAtendida.tempoDecorrido;
      senhas.push(senhaAtendida);
    });

  
    for (const tipo in temposMedios) {
      if (temposMedios.hasOwnProperty(tipo)) {
        const quantidade = senhas.filter(s => s.senha.numero.substring(7, 9) === tipo).length;
        temposMedios[tipo] /= quantidade;
      }
    }
    console.log(senhas,temposMedios)
    return { senhas, temposMedios };
  }
}


export interface Senha {
  numero: string;
  dataHora: Date;
  dataHoraAtendimento?: Date; 
}
