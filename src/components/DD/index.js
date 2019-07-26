import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleUp, faAngleDown, faCheck } from '@fortawesome/free-solid-svg-icons'
import './styles.css'

class DD extends Component{
  constructor(props){
    super(props)
    this.state = {
      listOpen: false,
      headerTitle: this.props.title
    }
    this.close = this.close.bind(this)
  }

  componentDidUpdate(){
    const { listOpen } = this.state
    setTimeout(() => {
      if(listOpen){
        window.addEventListener('click', this.close)
      }
      else{
        window.removeEventListener('click', this.close)
      }
    }, 0)
  }

  componentWillUnmount(){
    window.removeEventListener('click', this.close)
  }

  close(timeOut){
    this.setState({
      listOpen: false
    })
  }

  selectItem(title, id, stateKey){
    this.setState({
      headerTitle: title,
      listOpen: false
    }, this.props.resetThenSet(id, stateKey), 
    this.props.onChange({index:this.props.list.findIndex(x => x.id === id), id:id}))
  }

  toggleList(){
    this.setState(prevState => ({
      listOpen: !prevState.listOpen
    }))
  }

  render(){
    const{list} = this.props
    const{listOpen, headerTitle} = this.state
    return (
      <div className="dd-wrapper">
        <div className="dd-header" onClick={() => this.toggleList()}>
          <div className="dd-header-title">{headerTitle}</div>
          {listOpen ? (
            <FontAwesomeIcon icon={faAngleUp} size="lg" />
          ) : (
            <FontAwesomeIcon icon={faAngleDown} size="lg" />
          )}
        </div>
        {listOpen && (
          <ul className="dd-list" onClick={e => e.stopPropagation()}>
            {list.map(item => (
              <li
                className="dd-list-item"
                key={item.id}
                onClick={() =>
                  this.selectItem(item.title, item.id, item.key)
                }
              >
                <img src={item.image}/>
                {item.title}{" "}
                {item.selected && <FontAwesomeIcon icon={faCheck} />}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default DD