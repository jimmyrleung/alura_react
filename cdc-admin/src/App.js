import React, { Component } from 'react';
import logo from './logo.svg';
//import './App.css';
import './css/pure-min.css';
import './css/side-menu.css';

class App extends Component {
  constructor() {
    super(); // Component

    // Estado inicial
    this.state = {
      lista: []
    };
  }
  // O componentWillMount poderia ser utilizado nesse caso, mas como estamos fazendo uma requisição assincrona
  // pode ser que o resultado da req chegasse somente depois do render, ou seja, nao adiantaria nada. 
  // O ideal é utilizar o componentWillMount para operações síncronas.

  // Já que a requisição é assíncrona, utilizamos o componentDidMount
  componentDidMount() {
    fetch("http://localhost:3002/api/authors")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        let authors = [];

        data.forEach(author => {
          authors.push({ id: author._id, nome: author._name, email: author._email, senha: author._password });
        });

        console.log(authors);

        // Seta um novo estado e chama o render - custaria muita CPU ficar olhando a alteração da variável state
        // Se não utilizassemos arrow functions teríamos q fazer um bind com o escopo do react ou usar o self = this
        this.setState({ lista: authors });
      })
      .catch(err => console.log(err));
  }

  enviaForm(evt) {
    evt.preventDefault();
    console.log("Enviando dados do formulário...");
  }

  render() {
    return (
      <div id="layout">
        {/* Menu toggle -->*/}
        <a href="#menu" id="menuLink" className="menu-link">
          {/*<!-- Hamburger icon -->*/}
          <span></span>
        </a>
        <div id="menu">
          <div className="pure-menu">
            <a className="pure-menu-heading" href="#">CDC-Admin</a>

            <ul className="pure-menu-list">
              <li className="pure-menu-item"><a href="#" className="pure-menu-link">Home</a></li>
              <li className="pure-menu-item"><a href="#" className="pure-menu-link">Autor</a></li>
              <li className="pure-menu-item"><a href="#" className="pure-menu-link">Livro</a></li>
            </ul>
          </div>
        </div>

        <div id="main">
          <div className="header">
            <h1>Cadastro de Autores</h1>
          </div>
          <div className="content" id="content">
            <div className="pure-form pure-form-aligned" style={{ marginTop: 10 + 'px' }}>
              <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                <div className="pure-control-group">
                  <label htmlFor="nome">Nome</label>
                  <input id="nome" type="text" name="nome" value="" />
                </div>
                <div className="pure-control-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" name="email" value="" />
                </div>
                <div className="pure-control-group">
                  <label htmlFor="senha">Senha</label>
                  <input id="senha" type="password" name="senha" />
                </div>
                <div className="pure-control-group">
                  <label></label>
                  <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                </div>
              </form>
            </div>
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
          </div>
        </div>
      </div>
    );
  }
}

export default App;
