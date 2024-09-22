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

    // mobile swipe detection https://stackoverflow.com/questions/70612769/how-do-i-recognize-swipe-events-in-react
    /*                                                                                     */
    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)
    const [justSwitched, setJustSwitched] = useState(false)

    // the required distance between touchStart and touchEnd to be detected as a swipe
    const minSwipeDistance = 50

    const onTouchStart = (e) => {
        setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance
        if (isLeftSwipe || isRightSwipe) {
            isLeftSwipe ? handleNext() : handlePrev();
        }
        setTouchStart(null)
        setTouchEnd(null)
    }
    /*                                                                                     */

    const handlePrev = () => {
        setJustSwitched(true);
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setJustSwitched(true);
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
        const timeout = setTimeout(() => {
            setJustSwitched(false);
        }
            , 300);
        return () => clearTimeout(timeout);
    }, [justSwitched]);

    useEffect(() => {
        const carouselContainer = document.querySelector(`.${styles.carouselContainer}`);

        for (const child of carouselContainer.children) {
            child.addEventListener('wheel', debouncedHandleScroll);
            child.addEventListener('wheel', preventDefaultScroll, { passive: false });
        }

        return () => {
            ;

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
        <div className={styles.carouselContainer}>
            <button className={styles.navButton + ' ' + styles.prev} onClick={handlePrev}>‹</button>
            <div className={styles.carousel} style={{ width: size, height: size }} onTouchStart={onTouchStart}
                onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onClick={(e) => {
                    // if clicked on the left or right, go to it
                    if (e.clientX < size / 2) {
                        handlePrev();
                    } else {
                        handleNext();
                    }
                }}>
                {images.map((image, index) => {

                    const [current, setCurrent] = useState({ x: 0, y: 0 });

                    function tilt(e) {
                        if (justSwitched) return;
                        const x = e.clientX / window.innerWidth - 0.5;
                        const y = e.clientY / window.innerHeight - 0.5;
                        setCurrent({ x: y * 10, y: x * -10 });
                    }

                    function reset() {
                        setCurrent({ x: 0, y: 0 });
                    }

                    return (
                        <Image
                            key={index}
                            width={size}
                            height={size}
                            priority='lazy'
                            src={image.src}
                            alt={image.alt}
                            className={styles.image + ' ' + (current.x !== 0 && current.y !== 0 ? styles.tilt : '')}
                            style={{
                                display: getVisible(index, currentIndex, images.length),
                                transform: `translate(-50%, -50%)
                                ${getTransformValue(index, currentIndex, images.length)}` + ' ' +
                                    (index == currentIndex ? 'scale(.8)' : 'scale(0.5)') + ' ' +
                                    'perspective(1000px) rotateX(' + -current.x + 'deg) rotateY(' + -current.y + 'deg)',
                                boxShadow: current.x !== 0 && current.y !== 0 ? `${current.x * 2}px ${current.y * 2}px 10px rgba(0, 0, 0, 0.5)` : 'none'
                            }}
                            onMouseMove={tilt}
                            onMouseLeave={reset}
                        />
                    );
                })}
            </div>
            <button className={styles.navButton + ' ' + styles.next} onClick={handleNext}>›</button>
        </div>
    );
};