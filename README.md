# 🏷️ Sistema de Aluguel de Carros 👨‍💻

O objetivo deste projeto consiste na construcao de um sistema para apoio a gestão de aluguéis de automoveis, permitindo efetuar, cancelar, consultar e modificar pedidos de aluguel pela Internet.


## 📝 Sobre o Projeto
O software propõe o desenvolvimento de um sistema web para controle e gestão de locação de automóveis, oferecendo aos clientes uma interface intuitiva para realizar, cancelar e modificar reservas de forma autônoma. A plataforma centraliza o gerenciamento da frota de veículos, o acompanhamento de contratos e o histórico de locações, garantindo maior eficiência operacional para a empresa e uma experiência ágil e acessível para o usuário final.

## Objetivo

Desenvolver um software em Java utilizando Micronaut, para gerenciar pedidos e contratos de aluguel de carros, incluindo analise financeira por agentes (empresas e bancos) e acompanhamento do ciclo completo do pedido.

## ✨ Funcionalidades Principais

- 🔐 **Autenticação Segura:** Login, Cadastro e Recuperação de Senha.
- 📈 **Gestão de Solicitações de Aluguel:**  Criação, consulta, modificação e cancelamento de pedidos de aluguel..
- 📊 **Avaliação de Solicitações:** Análise financeira, modificação, aprovação/reprovação e execução de contratos por empresas e bancos.
- 👤 **Gestão de Contratantes:** Cadastro de dados pessoais (RG, CPF, Nome, Endereço), profissão, vínculos empregatícios e rendimentos (até 3 entidades).
- 🚗 **Gestão de Automóveis:** Cadastro de veículos com matrícula, ano, marca, modelo e placa, incluindo registro de propriedade conforme tipo de contrato.
- 📄 **Gestão de Contratos:** Criação e acompanhamento de contratos de aluguel, com suporte à associação de contratos de crédito concedidos por bancos agentes.


## Tecnologias Utilizadas

- **Java**: 21
- **Micronaut**: 4.x
- **Maven**: build e execucao do backend
- **React**: 19
- **React Router**: 7
- **Vite**: 7
- **Node.js + npm**: build e execucao do frontend

## Dependencias

- Backend: gerenciadas pelo `Maven` no arquivo `backend/pom.xml`
- Frontend: gerenciadas pelo `npm` no arquivo `frontend/package.json`


## 📂 Estrutura de Pastas
```
/
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── README.md
├── docs/
│   ├── Diagrama-casos-de-uso-v3.png
│   ├── Diagrama de componentes.png
│   ├── Diagrama-de-implantação.png
│   └── uml_classes_pacotes.png
├── frontend/
│   ├── app/
│   ├── public/
│   ├── package.json
│   └── README.md
└── README.md
```


## Instalacao e Execucao

### Pre-requisitos

- Java 21
- Maven
- Node.js 18+ e npm



### Passos

1. Inicie o backend a partir da raiz do repositorio:

	```bash
	mvn -f backend/pom.xml mn:run
	```

2. Em outro terminal, inicie o frontend:

	```bash
	cd frontend
	npm install
	npm run dev
	```

3. Acesse a aplicacao no navegador:

	- Frontend: http://localhost:5173
	- Backend: http://localhost:8080




## Modelos UML

### Diagrama de Casos de Uso
![Diagrama de Casos de Uso](docs/Diagrama-casos-de-uso-v3.png)

### Diagrama de Classes e Pacotes
![Diagrama de Classes e Pacotes](docs/uml_classes_pacotes.png)

### Diagrama de Componentes
![Diagrama de Componentes](docs/Diagrama%20de%20componentes.png)

### Diagrama de Implantação
![Diagrama de Implantação](docs/Diagrama-de-Implantação.png)

## Integrantes

- Ana Luiza de Freitas Rodrigues
- Felipe Augusto Mendes Pereira
- Francisco Rafael Pereira Rodrigues
- Kayke Emanoel de Souza Santos

## Professor Responsavel

- Joao Paulo Carneiro Aramuni

## Licenca

Definir a licenca oficial do projeto.
