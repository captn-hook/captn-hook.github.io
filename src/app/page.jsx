import styles from "./page.module.css";
import Nav from "@/components/nav/nav";
import Carousel from "@/components/carousel/carousel";
import GithubCard from "@/components/card/githubCard";
import Video from "@/components/video/video";

export default function Home() {


  const repos = [
    "captn-hook/api",
    "captn-hook/brigNew",
    "captn-hook/h5n1map",
  ];

  return (
    <main className={styles.main}>
      <Nav refs={['Intro', 'Demo Video', 'Sample Projects', 'Resume', 'Github', 'About']} />
      <div className={styles.topSpacer} id="Intro" />
      <p className={styles.description}>
        I have been professionally working as a website developer as well as a 3D designer for a few years now.
        <br />
        Like any decent coder, am proficient in many programming languages and software suites, and have no fear of learning any new ones.
        <br />
        By teaching mself, I have become a Blender expert, although I have touched other 3D modeling software. I also know my
        way around Adobe Creative Suite, though I prefer GIMP to Photoshop. Additionally, I have used
        both Unity and Unreal.
        <br />
        As far as languages, I am enamored with Rust, but I always find myself preferring speed, so JavaScript
        and Python are what I use to solve most problems. I have also used C, C++, TypeScript, Raku, and Assembly
        for school projects.
      </p>
      <p className={styles.description} id="Demo Video">
        Here is a sample of some of my work, foremost being a video I made for Gingko Bioworks, a company that
        tracked the spread of COVID-19 in air travel.
      </p>
      <Video src="/covidPlanes.mp4" type="video/mp4 " />
      <h3 className={styles.title} id="Sample Projects">Here are some of my favorite projects:</h3>
      <p className={styles.description} id="Sample Projects"> 
        This is an interactive data visualization I made for Poppy Health, a company that tracks the spread of viral
        particles in the air. The full site is available at <a href="https://view.poppy.com">view.poppy.com</a>.
      </p>
      <iframe className={styles.viewer} src="https://view.poppy.com/embed/" title="3D Viewer" />
      <p className={styles.description}>
        This is a map of the spread of H5N1, a deadly strain of bird flu. The map is interactive, and can be found at <a href="https://www.ginkgobiosecurity.com/h5n1-us-tracker/">ginkgobiosecurity.com/h5n1-us-tracker</a>.
      </p>
      <iframe className={styles.viewer} src="https://public.ginkgobiosecurity.com/h5n1-map/" title="H5N1 Map" />
      <div className={styles.topSpacer} />
      <iframe className={styles.resume} src="/Resume.pdf#toolbar=0#view=Fit" title="Resume" id="Resume" />
      <p className={styles.description} id="Github">
        Below are some of my favorite Github projects:
      </p>
      <ul className={styles.cardList}>
        {repos.map((repo) => (
          <li key={repo}>
            <GithubCard key={repo} repo={repo} />
          </li>
        ))}
      </ul>
      <div className={styles.bottomSpacer} />
      <h1 className={styles.title} id="About">Hi! I'm Tristan Hook,<br />get to know me!</h1>
      <p className={styles.description}>
        I am currently a student at Oregon State University studying computer science.
        <br />
        When choosing my major for college, there was little doubt about what I would do, as both my
        father and grandfather were computer scientists.
        <br /><br />
        Of course, they very much forged their own path, before the field was codified into real degrees.
        <br />
        They got there by pursuing their passions, and that is the greatest lesson I have ever been taught.
        I love learning, and deeply want to continue to learn as long as I live.
        <br /><br />
        I love teaching myself new things, and want to go back to school at some point after I finish out
        my CS degree. I have taken coursework that wasn't necessary for my degree, such mechanical
        engineering, physics, and psychology. What most excites me about continuing education
        is the opportunity to bring my familiarity with computers to other fields, and drive innovation in them.
        <br /><br />
        Away from my desk, I am a huge fan of the outdoors. Specifically, my absolute favorite
        feeling in the world is snowboarding. I have been snowboarding for a very long time,
        and it was the decider in moving to Bend, Oregon. I also enjoy mountain biking, durring the off season.
      </p>
      <Carousel
        images={[
          {            src: "/nice.jpg",            alt: "Photo of me",          },
          {            src: "/dog.jpg",            alt: "Photo of my dog",          },
          {            src: "/school.jpg",            alt: "Photo of me at school"          },
          {            src: "/dad.jpg",            alt: "Photo of me and my dad",          },
          {            src: "/silly.jpg",            alt: "Second photo of me",          },
          {            src: "/fast.jpg",            alt: "Photo of me going fast",          },
        ]}
      />
      <footer className={styles.footer}>
        Made by Tristan Hook, 9/24
      </footer>
    </main>
  );
}
