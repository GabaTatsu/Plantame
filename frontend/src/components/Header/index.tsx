import React from 'react';
import logoPlantame from '../../assets/images/logoPlantame.png';
import headerPlantame from '../../assets/images/headerPlantame.png';
import './style.css';

const Header: React.FC = () => {
    return (
        <header>
            <img
                src={logoPlantame}
                title="Logo Plántame"
                alt="Logo Plántame"
            ></img>
            <img
                src={headerPlantame}
                title="Título Plántame"
                alt="Título Plántame"
            ></img>
        </header>
    );
};

export default Header;
