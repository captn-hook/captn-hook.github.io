'use client';
import { useState, useEffect } from "react";
import styles from "./nav.module.css";

export default function Nav({ refs }) {
    const [isVisible, setIsVisible] = useState(true);

    // hide the nav bar after mouse moves away for 3 seconds
    useEffect(() => {
        let timeout;
        function handleMouseMove(e) {
            if (e.clientY < 100) {
                setIsVisible(true);
                clearTimeout(timeout);
            } else {
                setIsVisible(false);
                timeout = setTimeout(() => setIsVisible(false), 3000);
            }
        }
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
    
    return (
        <nav className={`${styles.nav} ${isVisible ? '' : styles.hidden}`}>
            <ul>
                {refs.map((ref, i) => (
                    <li key={i}>
                        <a href={'#' + ref}>{ref}</a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}