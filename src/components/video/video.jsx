'use client';
import { useEffect, useRef } from 'react';
import styles from './video.module.css';

// Plays only while on screen. preload="metadata" so the video isn't
// downloaded until the visitor actually scrolls to it.
export default function Video({ src, poster, type }) {
    const videoRef = useRef(null);

    useEffect(() => {
        const videoElement = videoRef.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    videoElement.play().catch(() => {});
                } else {
                    videoElement.pause();
                }
            },
            { threshold: 0.5 }
        );
        observer.observe(videoElement);
        return () => observer.disconnect();
    }, []);

    return (
        <video ref={videoRef} className={styles.video} loop muted playsInline preload="metadata" poster={poster}>
            <source src={src} type={type} />
        </video>
    );
}
