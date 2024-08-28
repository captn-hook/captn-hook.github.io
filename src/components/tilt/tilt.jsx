'use client';
import styles from './tilt.module.css';
import { useState } from 'react';

export default function Tilt({ children }) {
    // skews the element based on mouse position, returns to 0
    const [current, setCurrent] = useState({ x: 0, y: 0 });

    function tilt(e) {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        setCurrent({ x: y * 10, y: x * -10 });
    }

    function reset() {
        setCurrent({ x: 0, y: 0 });
    }

    return (
        <div className={styles.tilt} onMouseMove={tilt} onMouseLeave={reset}
            style={{
                transform: `perspective(1000px) rotateX(${current.y}deg) rotateY(${current.x}deg)`,
            }}
        >
            {children}
        </div>
    );
}
