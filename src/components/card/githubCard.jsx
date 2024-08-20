'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './cards.module.css';

export default function GithubCard({ repo }) {
    // we have to curl the repo to make the card
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`https://api.github.com/repos/${repo}`)
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                fetch(`https://raw.githubusercontent.com/${data.full_name}/${data.default_branch}/README.md`)
                    .then((res) => res.text())
                    .then((text) => {
                        // limit the readme to 500 characters
                        if (text.length > 500) {
                            text = text.slice(0, 500) + '...';
                        }
                        const newData = { ...data, readme: text };
                        setData(newData);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                setError(err);
            });
    }, [repo]);

    if (error) {
        return <div className={styles.card}>Error: {error.message}</div>;
    } else if (!data) {
        return <div className={styles.card}>Loading...</div>;
    } else {
        try {
            return (
                <a href={data.html_url} className={styles.card}>
                    <div className={styles.cardHeader}>
                        <Image src={data.owner.avatar_url} alt="Owner Avatar" width={100} height={100} />
                        <div className={styles.dateContainer}>
                            <div className={styles.date}>
                                <h3>Updated:</h3>
                                <h3>{new Date(data.updated_at).toLocaleDateString()}</h3>
                            </div>
                            <div className={styles.divider}></div>
                            <div className={styles.date}>
                                <h3>Created:</h3>
                                <h3>{new Date(data.created_at).toLocaleDateString()}</h3>
                            </div>
                        </div>
                    </div>
                    <h2>{data.full_name}</h2>
                    <p>{data.description}</p>

                    <p markdown="1">{data.readme}</p>
                </a>
            );
        } catch (err) {
            return <a className={styles.card}>Failed to load Github repo!</a>;
        }
    }
}