import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AutorBox } from './Components/Autor';
import { Home } from './Components/Home'

ReactDOM.render((
    <Router>
        <App> {/* O router recebe um único componente (qualquer componente) */}
            <Switch>{/* Dentro do switch declaramos nossas rotas. O switch garante que apenas uma delas será acionada. */}
                <Route exact path="/" component={Home} />
                <Route path="/autor" component={AutorBox} />
                <Route path="/livro" component={Home} />
            </Switch>
        </App>
    </Router>
), document.getElementById('root'));
registerServiceWorker();
