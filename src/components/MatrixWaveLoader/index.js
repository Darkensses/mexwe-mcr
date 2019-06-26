import React from 'react';
import './styles.css'

const MatrixWaveLoader = () => {

    const createItems = () => {
        let items = [];
        for(var i = 0; i < 25; i++) {
            items.push(<li key={'li'+i} className='li__item'></li>)
        }
        return items;
    }

    return(
        <div className='wrapper'>
            <ul className='ul__item'>
                {createItems()}
            </ul>
        </div>
    );
}

export default MatrixWaveLoader;