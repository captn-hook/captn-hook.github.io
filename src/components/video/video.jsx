'use client';
import { useEffect, useRef } from 'react';
import styles from './video.module.css';

export default function Video({ src, type }) {

    const videoRef = useRef(null);

    useEffect(() => {
        const videoElement = videoRef.current;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        videoElement.play();
                    } else {
                        videoElement.pause();
                    }
                });
            },
            { threshold: 0.5 } // Adjust the threshold as needed
        );

        if (videoElement) {
            observer.observe(videoElement);
        }

        return () => {
            if (videoElement) {
                observer.unobserve(videoElement);
            }
        };
    }, []);

    return (
        <video ref={videoRef} className={styles.video} autoPlay loop muted id="Datavis">
            <source src={src} type={type} />
        </video>
    );
}