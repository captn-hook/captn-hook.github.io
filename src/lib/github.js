// Fetched at build time (static export), so visitors never hit the GitHub API
// or its 60 req/hr unauthenticated limit. CI passes GITHUB_TOKEN for headroom.

// Colors from github-linguist, so the dots match what GitHub shows.
export const LANGUAGE_COLORS = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Svelte: '#ff3e00',
    Python: '#3572A5',
    Rust: '#dea584',
    'C++': '#f34b7d',
    C: '#555555',
    CSS: '#663399',
    HTML: '#e34c26',
    Shell: '#89e051',
    Dockerfile: '#384d54',
};

async function gh(path) {
    const headers = { Accept: 'application/vnd.github+json' };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(`https://api.github.com${path}`, { headers });
    if (!res.ok) throw new Error(`GitHub ${path}: ${res.status}`);
    return res.json();
}

// Returns null on failure so the card can fall back to the static info it was given.
export async function getRepo(fullName) {
    try {
        const [repo, languages] = await Promise.all([
            gh(`/repos/${fullName}`),
            gh(`/repos/${fullName}/languages`),
        ]);
        const total = Object.values(languages).reduce((a, b) => a + b, 0);
        return {
            name: repo.name,
            owner: repo.owner.login,
            url: repo.html_url,
            homepage: repo.homepage || null,
            description: repo.description,
            visibility: repo.private ? 'Private' : 'Public',
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            pushedAt: repo.pushed_at,
            languages: Object.entries(languages).map(([name, bytes]) => ({
                name,
                percent: total ? (bytes / total) * 100 : 0,
            })),
        };
    } catch (err) {
        console.warn(`Could not load ${fullName}, rendering fallback card.`, err.message);
        return null;
    }
}
