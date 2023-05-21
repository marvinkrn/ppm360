import { ProjectsOverview } from "./components/ProjectsOverview";
import { Login } from "./components/Login";
import Request from "./components/Requests";
import ReviewProjects from "./components/ReviewProjects";
import { Dashboard } from "./components/Dashboard";
import Home from "./components/Home";
import ProjectsCreate from "./components/modals/ProjectsCreate";
import ProjectsModify from "./components/ProjectDetails";
import ProjectDetails from "./components/ProjectDetails";


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
    path: '/projectsoverview',
    element: <ProjectsOverview />
  },
  {
    path: '/projects/create',
    element: <ProjectsCreate />
  },
  {
    path: '/projects/:id',
    element: <ProjectDetails />
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
