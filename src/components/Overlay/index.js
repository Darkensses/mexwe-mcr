import React from "react";
import styled from "styled-components";
import { CSSTransition } from "react-transition-group";
import "./styles.css";

export default class Overlay extends React.Component {
  render() {
    console.log(this.props.active);
    let isActive = null;
    let color = null;

    if (this.props.active) isActive = this.props.active;

    if (this.props.color) {
      color = this.props.color;
    } else {
      color = "white";
    }

    const Wrapper = styled.div`
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      width: 100%;
      height: 100%;
      visibility: ${isActive ? 'visible' : 'hidden'};
      overflow: hidden !important;
      align-items: center;
      justify-content: center;
      z-index: 2;
    `;

    const OverlayWrapper = styled.div`
      display: flex;
      align-items: center;
      justify-content: center;
      width: 200vw;
      height: 200vh;
      background: rgba(0, 0, 0, 0.7);
      transition: opacity 500ms ease-in;
      opacity: ${isActive ? '1' : '0'};      
    `;

    const Loader = styled.div`
      position: absolute;
      text-align: center;
      color: white;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 99;
    `;

    let textElement = null;
    let loaderElement = null;
    if (this.props.text) textElement = <div className='text__loader'>{this.props.text}</div>;
    if (this.props.loader) loaderElement = <div>{this.props.loader}</div>;

    //if (isActive) {setInProp = isActive;}
    return (
      <Wrapper>
        <CSSTransition
          in={isActive}
          timeout={900}
          classNames="dialog"
          unmountOnExit
        >
          <OverlayWrapper id="overlay__wrapper">
            <Loader>
              {loaderElement}
              {textElement}
            </Loader>
            
          </OverlayWrapper>
        </CSSTransition>
      </Wrapper>
    );
  }
}
