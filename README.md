# Hackaton SOAT Web

Projeto web desenvolvido com [Nuxt 3](https://nuxt.com/) para o Hackaton SOAT.

## Descrição

Este projeto é uma aplicação web moderna, utilizando Nuxt 3, TypeScript e uma estrutura modular para facilitar o desenvolvimento, manutenção e escalabilidade. O objetivo é fornecer uma interface intuitiva para manipulação de arquivos, autenticação e visualização de dados.

## Funcionalidades

- Upload e visualização de arquivos
- Autenticação via Cognito
- Listagem de itens
- Controle de modo de cor (dark/light)
- Interface responsiva

## Estrutura do Projeto

```
hackaton-soat-web/
├── app/
│   ├── assets/
│   │   └── css/
│   │       └── main.css
│   ├── components/
│   │   ├── CardItem.vue
│   │   ├── ColorModeButton.vue
│   │   ├── Default.vue
│   │   ├── FileForm.vue
│   │   ├── Footer.vue
│   │   ├── Header.vue
│   │   └── List.vue
│   ├── composables/
│   │   ├── event.ts
│   │   └── useCognitoAuth.ts
│   ├── interface/
│   │   └── file.interface.ts
│   ├── mocks/
│   │   └── files.mock.ts
│   ├── pages/
│   │   └── index.vue
│   └── utils/
│       └── formatByteSize.ts
├── public/
│   ├── robots.txt
│   └── silent-renew.html
├── nuxt.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Instalação

1. Clone o repositório:
    ```bash
    git clone https://github.com/SOAT-Project/hackaton-soat-web.git
    ```
2. Acesse o diretório do projeto:
    ```bash
    cd hackaton-soat-web
    ```
3. Instale as dependências:
    ```bash
    npm install
    ```

## Uso

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera o build de produção
- `npm run preview`: Visualiza o build de produção localmente

## Tecnologias Utilizadas

- Nuxt 3
- TypeScript
- CSS
- AWS Cognito (autenticação)
