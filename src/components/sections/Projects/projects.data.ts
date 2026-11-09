
export type FeaturedProjectData = {
  id: number;
  name: string;
  image: string;
  href: string;
  technologies: string[];
};

export type UpcomingProjectData = {
  id: number;
  number: string;
};

export const featuredProject: FeaturedProjectData = {
  id: 1,
  name: "Vet101",
  image: "/images/projects/vet101/hero.png",
  href: "https://vet101.netlify.app/en",
  technologies: [
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "GSAP",
  ],
};

export const upcomingProjects: UpcomingProjectData[] = [
  {
    id: 2,
    number: "02",
  },
  {
    id: 3,
    number: "03",
  },
];
