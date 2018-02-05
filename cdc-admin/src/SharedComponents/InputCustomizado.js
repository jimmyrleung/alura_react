import React, { Component } from 'react';
import PubSub from 'pubsub-js';

class InputCustomizado extends Component {
    constructor() {
        super();
        this.state = { errorMsg: '' }
    }

    componentDidMount() {
        // o subscribe recebe dois parâmetros: o evento chamado e os dados enviados pelo publisher
        PubSub.subscribe("show-input-error", (event, err) => {
            if (this.props.name === err.field) {
                this.setState({ errorMsg: err.message });
            }
        });

        PubSub.subscribe("limpa-erros-formulario", () => {
            this.setState({ errorMsg: '' });
        });
    }

    render() {

        // O {this.props.id} se refere ao I d do componente
        return (
            <div className="pure-control-group">
                <label htmlFor={this.props.id}>{this.props.label}</label>
                <input id={this.props.id} type={this.props.type} name={this.props.nome} value={this.props.value} onChange={this.props.onChange} />
                <span className="erro"> {this.state.errorMsg}</span>
            </div>
        );
    }
}

export default InputCustomizado;