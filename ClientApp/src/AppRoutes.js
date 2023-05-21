import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import Home from "./components/Home";
import CreateProject from "./components/CreateProject";
import ProjectDetails from "./components/ProjectDetails";
import ApproveProjects from "./components/ApproveProjects";
import MyProjects from "./components/MyProjects";


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
    element: <MyProjects />
  },
  {
    path: '/projects/:id',
    element: <ProjectDetails />
  },
  {
    path: '/projects/create',
    element: <CreateProject />
  },
  {
    path: '/approve',
    element: <ApproveProjects />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
];

export default AppRoutes;
