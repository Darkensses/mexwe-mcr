import React from "react";
import "./styles.css"

function Modal(props) {

    const handleClose = () => {
        props.closeModal()
    }

    return(
        <div className="Modal__overlay" style={props.isOpen ? {display: 'flex'} : {display:'none'}}>
            <div className="Modal__content">
                {props.title}
                <div className="Modal__content__flex">
                    {props.children}
                </div>                
                <div className="Modal__footer">
                    <button onClick={handleClose}>Cerrar</button>
                </div>
            </div>
        </div>
    )
}

export default Modal;