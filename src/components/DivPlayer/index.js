import React from 'react'
import './styles.css'

export default class DivPlayer extends React.Component {
    render() {
        return(
            <div className='divPlayer__wrapper'>
                <div className='divPlayer__name'>{this.props.name}</div>
                <div className='divPlayer__number'>{this.props.number}</div>
                <div className='divPlayer__position'>{this.props.position}</div>
            </div>
        )
    }
}