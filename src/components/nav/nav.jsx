import styles from "./nav.module.css";

export default function Nav({ refs }) {
    // this nav just scrolls through hrefs on the page it is on
    return (
        <nav className={styles.nav}>
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

                        