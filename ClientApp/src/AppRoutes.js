import { ProjectsOverview } from "./components/ProjectsOverview";
import { Home } from "./components/Home";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/projects',
    element: <ProjectsOverview />
  }
];

export default AppRoutes;
