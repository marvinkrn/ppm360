import { ProjectsOverview } from "./components/ProjectsOverview";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import Request from "./components/Requests";
import ReviewProjects from "./components/ReviewProjects";


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
  },
  {
    path: '/requests',
    element: <Request />
  },
  {
    path: '/review',
    element: <ReviewProjects />
  },
];

export default AppRoutes;
