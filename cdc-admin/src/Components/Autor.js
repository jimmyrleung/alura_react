import React, { Component } from 'react';
import InputCustomizado from '../SharedComponents/InputCustomizado';
import PubSub from 'pubsub-js';

class CadastroAutores extends Component {
    constructor() {
        super(); // Component

        // Estado inicial
        this.state = {
            nome: '',
            email: '',
            senha: ''
        };

        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
    }

    enviaForm(evt) {
        evt.preventDefault();
        console.log(`Enviando dados...`);

        PubSub.publish("limpa-erros-formulario");

        fetch("http://localhost:3002/api/authors",
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: this.state.nome, email: this.state.email, password: this.state.senha })
            })
            .then(res => {
                let requestStatusCode = res.status;
                return Promise.all([requestStatusCode, res.json()]);
            })
            .then(result => {
                if (result[0] === 400) {
                    this.handleValidationErrors(result[1].errors);
                    return;
                }
                console.log("Atualizando lista...");
                PubSub.publish("atualiza-lista-autores");
            })
            .catch(err => console.log(err));
    }

    handleValidationErrors(errors) {
        errors.forEach((err) => {
            console.log(err);
            PubSub.publish("show-input-error", err);
        });
    }

    setNome(evt) {
        this.setState({ nome: evt.target.value });
    }

    setEmail(evt) {
        this.setState({ email: evt.target.value });
    }

    setSenha(evt) {
        this.setState({ senha: evt.target.value });
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned" style={{ marginTop: 10 + 'px' }}>
                {/* o onSubmit é um 'Synthetic Event' do React (um evento do react que está mapeado a um evento real)*/}
                <form className="pure-form pure-form-aligned" method="post" onSubmit={this.enviaForm}>
                    <InputCustomizado id="nome" type="text" name="name" value={this.state.nome} onChange={this.setNome} label="Nome" />
                    <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} label="Email" />
                    <InputCustomizado id="senha" type="password" name="password" value={this.state.senha} onChange={this.setSenha} label="Senha" />
                    <div className="pure-control-group">
                        <label></label>
                        <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                    </div>
                </form>
            </div>
        );
    }
}

class ListaAutores extends Component {
    constructor() {
        super();

        this.state = { lista: [] }
    }

    // O componentWillMount poderia ser utilizado nesse caso, mas como estamos fazendo uma requisição assincrona
    // pode ser que o resultado da req chegasse somente depois do render, ou seja, nao adiantaria nada. 
    // O ideal é utilizar o componentWillMount para operações síncronas.

    // Já que a requisição é assíncrona, utilizamos o componentDidMount
    componentDidMount() {
        PubSub.subscribe("atualiza-lista-autores", () => this.atualizaListaAutores());
        return this.atualizaListaAutores();
    }

    atualizaListaAutores() {
        this.getListaAutores()
            .then(data => {
                Reflect.apply(this.setListaAutores, this, [data]);
            })
            .catch(err => console.log(err));
    }

    // Should be used with Reflect.apply
    setListaAutores(list) {
        let authors = [];

        list.forEach(author => {
            authors.push({ id: author._id, nome: author._name, email: author._email, senha: author._password });
        });

        // Seta um novo estado e chama o render - custaria muita CPU ficar olhando a alteração da variável state
        // Se não utilizassemos arrow functions teríamos q fazer um bind com o escopo do react ou usar o self = this
        this.setState({ lista: authors });
    }

    getListaAutores() {
        return fetch("http://localhost:3002/api/authors")
            .then(res => res.json())
            .then(data => Promise.resolve(data))
            .catch(err => Promise.reject(err));
    }

    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            // Para cada item da lista retorna uma tr
                            // É uma boa prática definir uma key para ajudar o virtual DOM a identificar mais fácil elementos que mudaram
                            this.state.lista.map(function (autor) {
                                return (
                                    <tr key={autor.id}>
                                        <td>{autor.nome}</td>
                                        <td>{autor.email}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export class AutorBox extends Component {
    // O  render espera retornar um elemento pai com elementos filhos.
    // Retornar sem a div seria o mesmo que retorna 2 elementos pais.
    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de Autores</h1>
                </div>
                <div className="content" id="content">
                    <CadastroAutores />
                    <ListaAutores />
                </div>
            </div>
        );
    }
}