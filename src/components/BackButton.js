import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BackArrow from '../assets/img/arrow-left.svg';

class BackButton extends Component {
    static contextTypes = {
        router: PropTypes.object
    }

    render() {
        return (
            <img src={BackArrow} alt="Back Arrow" className='c-arrow--back' onClick={this.context.router.history.goBack}/>
        );
    }
}

export default BackButton;