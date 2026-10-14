'use client';
import { useState } from 'react';
import Image from 'next/image';
import styles from './carousel.module.css';

const SWIPE_DISTANCE = 50;

// Signed distance from the current slide, wrapping so neighbors are always ±1.
function getOffset(index, currentIndex, total) {
    let offset = index - currentIndex;
    const half = Math.floor(total / 2);
    if (offset > half) offset -= total;
    else if (offset < -half) offset += total;
    return offset;
}

export default function Carousel({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const go = (step) => {
        setTilt({ x: 0, y: 0 });
        setCurrentIndex((i) => (i + step + images.length) % images.length);
    };

    function onTouchEnd(e) {
        if (touchStart === null) return;
        const distance = touchStart - e.changedTouches[0].clientX;
        if (Math.abs(distance) > SWIPE_DISTANCE) go(distance > 0 ? 1 : -1);
        setTouchStart(null);
    }

    function onTilt(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: y * 10, y: x * -10 });
    }

    return (
        <div
            className={styles.carousel}
            role="region"
            aria-roledescription="carousel"
            aria-label="Photos"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') go(-1);
                if (e.key === 'ArrowRight') go(1);
            }}
        >
            <div
                className={styles.stage}
                onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
                onTouchEnd={onTouchEnd}
            >
                {images.map((image, index) => {
                    const offset = getOffset(index, currentIndex, images.length);
                    const isCurrent = offset === 0;
                    const rotate = isCurrent ? `perspective(1000px) rotateX(${-tilt.x}deg) rotateY(${-tilt.y}deg)` : '';
                    return (
                        <Image
                            key={image.src}
                            src={image.src}
                            alt={image.alt}
                            width={800}
                            height={800}
                            loading="lazy"
                            aria-hidden={!isCurrent}
                            className={`${styles.image} ${isCurrent ? styles.current : ''}`}
                            style={{
                                visibility: Math.abs(offset) > 2 ? 'hidden' : 'visible',
                                zIndex: 10 - Math.abs(offset),
                                transform: `translate(-50%, -50%) translateX(${offset * 70}%) scale(${isCurrent ? 1 : 0.6}) ${rotate}`,
                            }}
                            onClick={isCurrent ? undefined : () => go(offset)}
                            onMouseMove={isCurrent ? onTilt : undefined}
                            onMouseLeave={isCurrent ? () => setTilt({ x: 0, y: 0 }) : undefined}
                        />
                    );
                })}
                <button type="button" className={`${styles.navButton} ${styles.prev}`} onClick={() => go(-1)} aria-label="Previous photo">‹</button>
                <button type="button" className={`${styles.navButton} ${styles.next}`} onClick={() => go(1)} aria-label="Next photo">›</button>
            </div>
            <div className={styles.dots}>
                {images.map((image, index) => (
                    <button
                        key={image.src}
                        type="button"
                        className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
                        aria-label={`Show photo ${index + 1}`}
                        aria-current={index === currentIndex}
                        onClick={() => go(index - currentIndex)}
                    />
                ))}
            </div>
        </div>
    );
}
