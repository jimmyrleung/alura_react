import React, { Component } from 'react';

class InputCustomizado extends Component {
    render() {
        // O {this.props.id} se refere ao I d do componente
        return (
            <div className="pure-control-group">
                <label htmlFor={this.props.id}>{this.props.label}</label>
                <input id={this.props.id} type={this.props.type} name={this.props.home} value={this.props.value} onChange={this.props.onChange} />
            </div>
        );
    }
}

export default InputCustomizado;