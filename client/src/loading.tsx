import { useState, useEffect } from 'react';
import './loading.css';
import logo from './images/logo.png';

const loading: React.FC = () => {
    const [dots, setDots] = useState<string>('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length === 3 ? '' : prev + '.'))
        }, 500)

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loadingPage">
            <img src={logo} alt="" />
            <p>Loading{dots}</p>
        </div>
    )
}

export default loading;