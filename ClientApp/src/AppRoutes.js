import { ProjectsOverview } from "./components/ProjectsOverview";
import { Login } from "./components/Login";
import Request from "./components/Requests";
import ReviewProjects from "./components/ReviewProjects";
import { Dashboard } from "./components/Dashboard";
import Home from "./components/Home";
import ProjectsCreate from "./components/modals/ProjectsCreate";


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
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/projects',
    element: <ProjectsOverview />
  },
  {
    path: '/projects/create',
    element: <ProjectsCreate />
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
