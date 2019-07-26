import React from 'react'
import './styles.css'
import Checkbox from '../Checkbox';

export default class DivPlayer extends React.Component {

    render() {
        
        return (
          <div className="divPlayer__wrapper">
            <Checkbox
              handleCheckboxClick={this.props.handleCheckboxClick}
              item={this.props.item}
              isChecked={this.props.checkedListAll.includes(this.props.item)}
              selectedItems={this.props.selectedItems}
            />
            <div className="divPlayer__name">{this.props.name}</div>
            <div className="divPlayer__number">{this.props.number}</div>
            <div className="divPlayer__position">
              {this.props.position}
            </div>
          </div>
        );
    }
}