'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './carousel.module.css';

function getTransformValue(index, currentIndex, totalImages) {
    // current image is centered, all other images are offset to the sides
    const half = Math.floor(totalImages / 2);
    if (index === currentIndex) {
        return 'translateX(0)';
    } else {
        // decide if the image is to the left or right of the current image
        // taking care to loop around
        let offset = index - currentIndex;
        if (offset > half) {
            offset -= totalImages;
        } else if (offset < -half) {
            offset += totalImages;
        }
        return `translateX(${offset * 120}%)`;

    }
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function getVisible(index, currentIndex, totalImages) {
    const half = Math.floor(totalImages / 2);
    // if currentIndex, visible
    // or if 1 away from currentIndex, including wrap around
    if (index === currentIndex ||
        index === (currentIndex + 1) % totalImages ||
        index === (currentIndex - 1 + totalImages) % totalImages ||
        index === (currentIndex + 2) % totalImages ||
        index === (currentIndex - 2 + totalImages) % totalImages) {
        return 'block';
    } else {
        //console.log('setting invisible for', name);
        return 'none';
    }
}

export default function Carousel({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    const handleScroll = (event) => {
        if (event.deltaY < 0) {
            handlePrev();
        } else {
            handleNext();
        }
    };

    const debouncedHandleScroll = debounce(handleScroll, 100);

    const preventDefaultScroll = (event) => {
        event.preventDefault();
    };


    useEffect(() => {
        const carouselContainer = document.querySelector(`.${styles.carouselContainer}`);
        
        for (const child of carouselContainer.children) {
            child.addEventListener('wheel', debouncedHandleScroll);
            child.addEventListener('wheel', preventDefaultScroll, { passive: false });
        }

        return () => {;

            for (const child of carouselContainer.children) {
                child.removeEventListener('wheel', debouncedHandleScroll);
                child.removeEventListener('wheel', preventDefaultScroll);
            }
        };
    }, []);

    // calculate how big the images and carousel should be
    const [size, setSize] = useState(0);

    useEffect(() => {
        setSize(window.innerWidth * 0.4);
        window.addEventListener('resize', () => {
            setSize(window.innerWidth * 0.4);
        });
    }, []);



    return (
        <div className={styles.carouselContainer}>
            <button className={styles.navButton + ' ' + styles.prev} onClick={handlePrev}>‹</button>
            <div className={styles.carousel} style={{ width: size, height: size }}>
                {images.map((image, index) => (
                    <Image
                        key={index}
                        width={size}
                        height={size}
                        priority='lazy'
                        src={image.src}
                        alt={image.alt}
                        style={{
                            position: 'absolute',
                            objectFit: 'cover',
                            borderRadius: '10px',
                            transition: 'transform 0.3s',
                            display: getVisible(index, currentIndex, images.length),
                            left: '50%',
                            top: '50%',
                            transform: `translate(-50%, -50%)
                                ${getTransformValue(index, currentIndex, images.length)}` + ' ' +
                                (index == currentIndex ? 'scale(1)' : 'scale(0.7)'),
                        }}
                    />
                ))}
            </div>
            <button className={styles.navButton + ' ' + styles.next} onClick={handleNext}>›</button>
        </div>
    );
};