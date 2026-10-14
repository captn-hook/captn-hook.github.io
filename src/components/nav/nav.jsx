'use client';
import { useEffect, useRef, useState } from "react";
import styles from "./nav.module.css";

const ICONS = {
    // shown in light mode: switch to dark
    moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z',
    // shown in dark mode: switch to light
    sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
};

function currentTheme() {
    const set = document.documentElement.dataset.theme;
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function ThemeToggle() {
    // null until mounted, since the server can't know the visitor's theme
    const [theme, setTheme] = useState(null);

    useEffect(() => {
        setTheme(currentTheme());
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = () => setTheme(currentTheme());
        media.addEventListener('change', onChange);
        return () => media.removeEventListener('change', onChange);
    }, []);

    function toggle() {
        const next = currentTheme() === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        try { localStorage.setItem('theme', next); } catch { }
        setTheme(next);
    }

    return (
        <button type="button" className={styles.toggle} onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            {theme && (
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={theme === 'dark' ? ICONS.sun : ICONS.moon} />
                </svg>
            )}
        </button>
    );
}

// Sticky (not fixed) so it occupies real space and can never cover content.
// Links stay on one line and scroll sideways on narrow screens instead of wrapping;
// an arrow shows while there's more to the right.
export default function Nav({ links }) {
    const listRef = useRef(null);
    const [moreRight, setMoreRight] = useState(false);

    useEffect(() => {
        const list = listRef.current;
        const update = () => setMoreRight(list.scrollLeft + list.clientWidth < list.scrollWidth - 1);
        update();
        list.addEventListener('scroll', update, { passive: true });
        const observer = new ResizeObserver(update);
        observer.observe(list);
        return () => {
            list.removeEventListener('scroll', update);
            observer.disconnect();
        };
    }, []);

    return (
        <nav className={styles.nav} aria-label="Sections">
            <a href="#top" className={styles.brand}>Tristan Hook</a>
            <div className={styles.linksWrap}>
                <ul ref={listRef} className={`${styles.links} ${moreRight ? styles.faded : ''}`}>
                    {links.map(({ id, label }) => (
                        <li key={id}>
                            <a href={'#' + id}>{label}</a>
                        </li>
                    ))}
                </ul>
                {moreRight && (
                    <button type="button" className={styles.more} aria-label="Scroll sections right"
                        onClick={() => listRef.current.scrollBy({ left: listRef.current.clientWidth * 0.6, behavior: 'smooth' })}>
                        ›
                    </button>
                )}
            </div>
            <ThemeToggle />
        </nav>
    );
}
