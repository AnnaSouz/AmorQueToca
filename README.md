# Amor que Toca

Aplicativo web (PWA) para o **Projeto Amor que Toca**, uma iniciativa social que ensina instrumentos musicais gratuitamente a pessoas carentes no bairro Piracicamirim, em Piracicaba/SP.

O app ajuda os professores voluntários a **fazer a chamada da turma**, mesmo com internet instável, e a **identificar alunos em risco de abandonar as aulas**, a partir de três faltas consecutivas.

## Problema que o projeto resolve

Hoje as matrículas, a frequência e o empréstimo de instrumentos não são registrados de forma organizada. Sem esse histórico, a equipe não percebe quando um aluno começa a faltar, e muitos acabam deixando o projeto sem que ninguém tenha notado a tempo.

## Funcionalidades

Login da equipe com Firebase Authentication, com mensagem de erro genérica
 Tela inicial com a turma do dia e atalhos (protegida por login)
 Chamada com toque para marcar faltas e contadores de presentes e faltas
 Gravação da chamada no Firestore, com suporte offline e sem duplicar registros do mesmo dia
 Regra de alerta para alunos com 3 faltas consecutivas (`EvasaoService`, com testes)

## Tecnologias

- Angular e Angular Material
- Firebase (Authentication e Firestore) com AngularFire
- PWA (Service Worker)
- Vitest para os testes automatizados
- GitHub Actions para Integração Contínua

## Arquitetura

O código segue uma separação em camadas: a **tela** só exibe e recebe toques, o **serviço** aplica as regras e o **repositório** é o único que conversa com o banco de dados.

```
src/app/
├── modelos/         # Aluno e Presenca
├── paginas/         # Telas: login, inicio e chamada
├── repositorios/    # Acesso ao Firestore
└── servicos/        # Regras: autenticação, guarda de rota, registro de chamada e evasão
```

Cada presença é identificada por **turma + data + aluno**, então salvar a chamada duas vezes no mesmo dia atualiza o registro em vez de duplicá-lo.

## Como executar

Requisitos: Node.js 24 e npm.

```bash
npm install
ng serve
```
Para entrar utilize a conta teste: 
E-mail: pauo.teste@exemplo.com
Senha: TestandoAqui

Depois, abra `http://localhost:4200`.

## Versão publicada

https://amor-que-toca.web.app

Para publicar uma nova versão:

```bash
ng build
firebase deploy --only hosting
```

## Acesso

O acesso é restrito a uma lista de e-mails autorizados: a coleção `emailsAutorizados` no Firestore, em que o ID de cada documento é o e-mail em minúsculas. A lista é mantida pelo coordenador no Console do Firebase.

Quem está na lista pode criar a própria conta na tela **Criar conta** (`/cadastro`). E-mails fora da lista não conseguem se cadastrar, entrar nem acessar os dados (regras em `firestore.rules`, publicadas com `firebase deploy --only firestore:rules`).

## Testes

```bash
ng test --no-watch
```

A suíte tem 8 testes: 4 unitários da regra de 3 faltas consecutivas e 4 de integração entre o registro de chamada e o alerta de evasão (com o banco simulado em memória).

## Integração Contínua

A cada envio para a `main` ou Pull Request, o GitHub Actions instala as dependências, compila o app (`ng build`) e roda os testes. O fluxo está em `.github/workflows/ci.yml`.

## Segurança e privacidade

- As regras do Firestore liberam acesso apenas a usuários autenticados.
- Os dados usados no desenvolvimento são **fictícios**: nenhum dado real de alunos ou famílias é usado.
- Pontos já identificados para melhorar: refinar as regras do banco por coleção e fechar o cadastro aberto de usuários no Firebase Authentication.
