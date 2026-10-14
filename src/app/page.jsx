import styles from "./page.module.css";
import Nav from "@/components/nav/nav";
import Carousel from "@/components/carousel/carousel";
import GithubCard from "@/components/card/githubCard";
import Video from "@/components/video/video";

const SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "resume", label: "Resume" },
  { id: "github", label: "GitHub" },
  { id: "about", label: "About" },
];

// Curated descriptions; GitHub's own description is only used when one isn't given here.
const REPOS = [
  { repo: "captn-hook/brigNew", description: "Revamp of Brig: inspect airflow scans over 3D-mapped buildings. Live at view.poppy.com." },
  { repo: "captn-hook/h5n1map", description: "Embeddable, interactive SVG map tracking H5N1 across the US, built for Ginkgo Bioworks." },
  { repo: "captn-hook/LoreLibrary", description: "Wiki software for extensive world building. SvelteKit front end on Vercel, AWS backend deployed with CloudFormation." },
  { repo: "captn-hook/autobattler", description: "Auto battler game with AI-generated monsters, built with TypeScript, Svelte and a Python backend." },
  { repo: "captn-hook/MapPlacer", description: "Blender add-on for placing objects on a map from geographic data." },
  { repo: "captn-hook/api", description: "Dockerized REST API and MongoDB backend for businesses, reviews and users." },
];

// Framed media with a caption row underneath; links sit at the right of the caption.
// `wide` breaks out of the text column to span the full screen width.
function Figure({ caption, actions, wide, children }) {
  return (
    <figure className={`${styles.figure} ${wide ? styles.wide : ""}`}>
      {children}
      <figcaption className={styles.caption}>
        <span>{caption}</span>
        {actions && <span className={styles.actions}>{actions}</span>}
      </figcaption>
    </figure>
  );
}

function External({ href, children }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={styles.action}>{children} ↗</a>;
}

export default function Home() {
  return (
    <>
      <Nav links={SECTIONS} />
      <main className={styles.main} id="top">
        <header className={styles.hero} id="intro">
          <h1 className={styles.title}>Tristan Hook</h1>
          <p className={styles.subtitle}>Software engineer · 3D designer · data visualization</p>
        </header>

        <div className={styles.prose}>
          <p>
            I have been professionally working as a website developer and 3D designer for 5 years now.
            Like any generalist hacker, I am proficient in many programming languages and software suites, and love learning new ones.
          </p>
          <p>
            I am a Blender expert, and I have a deep passion for game development. I also know my way around Adobe Creative Suite, though I prefer open source.
          </p>
          <p>
            As far as languages, I am enamored with Rust, but I always find myself preferring speed of development, so JavaScript
            and Python are what I use to solve most problems. I have also used C, C++, Java, and React Native professionally.
          </p>
        </div>

        <section id="work" className={styles.section}>
          <h2 className={styles.heading}>Work</h2>
          <Figure wide caption="A visualization I made for Ginkgo Bioworks, a company that tracked the spread of COVID-19 in air travel.">
            <Video src="/covidPlanes.mp4" poster="/covidPlanes-poster.jpg" type="video/mp4" />
          </Figure>
        </section>

        <section id="projects" className={styles.section}>
          <h2 className={styles.heading}>Projects</h2>
          <Figure
            wide
            caption="An interactive 3D data visualization I made for Poppy Health, a company that tracks the spread of viral particles in the air."
            actions={<External href="https://view.poppy.com">Open</External>}
          >
            <iframe className={styles.viewer} src="https://view.poppy.com/embed/" title="Poppy Health 3D airflow viewer" loading="lazy" />
          </Figure>

          {/*
            H5N1 map: archived static build served from public/h5n1-map/ (the hosted copy at
            public.ginkgobiosecurity.com/h5n1-map/ now returns 403).
            Source: github.com/captn-hook/h5n1map (Next.js 14 static export, basePath "/h5n1-map").
            To rebuild, work on a copy of the repo, not the original clone, and apply these patches:
              - src/components/utils/data.js: always return the bundled public/data/combined_data.json
                with lastUpdated "3/24/2025 (archived)", instead of fetching the dead S3 bucket.
              - src/components/map/tooltip.module.css: .tooltip is position: fixed (x/y are client coords).
              - src/components/map/map.jsx: track the cursor with one window pointermove listener
                (rAF-throttled) instead of per-county mousemove listeners.
              - src/components/map/tooltip.jsx: flip the tooltip left of the cursor near the right edge.
            Then `npm ci && npm run build`, copy h5n1-map/h5n1-map/* into public/h5n1-map/, and delete
            the data/ folder (the data is bundled into the JS, so it isn't fetched at runtime).
            Note: the build ships the commercial Aktiv Grotesk font files.
          */}
          <Figure
            wide
            caption="An interactive map of the spread of H5N1, a deadly strain of bird flu, built for Ginkgo Bioworks. Archived copy with surveillance data from January 2022 to March 2025."
            actions={<External href="/h5n1-map/">Full screen</External>}
          >
            <iframe className={styles.viewer} src="/h5n1-map/" title="H5N1 US tracker map" loading="lazy" />
          </Figure>
        </section>

        <section id="resume" className={styles.section}>
          <h2 className={styles.heading}>Resume</h2>
          <Figure
            caption="Resume (PDF)"
            actions={
              <>
                <External href="/Resume.pdf">Open</External>
                <a href="/Resume.pdf" download="Tristan-Hook-Resume.pdf" className={styles.action}>Download ↓</a>
              </>
            }
          >
            {/* Mobile browsers mostly can't render PDFs inline; they get the button and links below instead. */}
            <iframe className={styles.resume} src="/Resume.pdf#toolbar=0&view=FitH" title="Tristan Hook's resume" loading="lazy" />
            <p className={styles.resumeFallback}>
              <a href="/Resume.pdf" target="_blank" rel="noopener noreferrer" className={styles.button}>View resume (PDF)</a>
            </p>
          </Figure>
        </section>

        <section id="github" className={styles.section}>
          <h2 className={styles.heading}>GitHub</h2>
          <ul className={styles.cardList}>
            {REPOS.map(({ repo, description }) => (
              <li key={repo}>
                <GithubCard repo={repo} description={description} />
              </li>
            ))}
          </ul>
          <p className={styles.more}>
            More at <a href="https://github.com/captn-hook">github.com/captn-hook</a>
          </p>
        </section>

        <section id="about" className={styles.section}>
          <h2 className={styles.heading}>Get to know me!</h2>
          <div className={styles.prose}>
            <p>
              I was a student at Oregon State University, and I got my Software Engineering degree in 2025. When choosing my major for
              college, I knew where my strengths lay, as both my father and grandfather were computer scientists.
            </p>
            <p>
              Of course, they very much forged their own path, before the field was codified into degrees and shifted due to AI. They
              got there by pursuing their passions, and that is the greatest lesson I have ever been taught. I love learning, and
              want to continue to learn and work on novel challenges.
            </p>
            <p>
              Away from my desk, I am a huge fan of the outdoors here in Bend. Winter is my season, if the snowfall provides.
              Snowboarding was the decider in moving to Bend, and I make do with biking and hiking through the summer.
            </p>
          </div>
          <Carousel
            images={[
              { src: "/nice.jpg", alt: "Photo of me" },
              { src: "/dog.jpg", alt: "Photo of my dog" },
              { src: "/school.jpg", alt: "Photo of me at school" },
              { src: "/dad.jpg", alt: "Photo of me and my dad" },
              { src: "/silly.jpg", alt: "Second photo of me" },
              { src: "/fast.jpg", alt: "Photo of me going fast" },
            ]}
          />
        </section>
      </main>
      <footer className={styles.footer}>
        Made by Tristan Hook · updated 10/26
      </footer>
    </>
  );
}
