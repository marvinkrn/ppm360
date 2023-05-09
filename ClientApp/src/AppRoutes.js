import { ProjectsOverview } from "./components/ProjectsOverview";
import { Home } from "./components/Home";
import { Login } from "./components/Login";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/projects',
    element: <ProjectsOverview />
  }
];

export default AppRoutes;
