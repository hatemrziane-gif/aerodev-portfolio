import ProjectsHeader from "./ProjectsHeader";
import FeaturedProject from "./FeaturedProject";
import ProjectCard from "./ProjectCard";

import { upcomingProjects } from "./projects.data";

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative w-full overflow-hidden bg-ivory text-obsidian"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 py-28 md:px-12 lg:px-20">
        <ProjectsHeader />

        <FeaturedProject />

        {/* Upcoming Projects */}
        <div className="mt-24 grid grid-cols-1 gap-5 md:grid-cols-2">
          {upcomingProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}