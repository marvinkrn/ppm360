import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileCirclePlus, faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from "react-chartjs-2";
import FigureCard from './misc/FigureCard';
import { Button, Row } from 'reactstrap';
import { ProjectsOverview } from './ProjectsOverview';
import jwt_decode from 'jwt-decode';
import Unauthorized from './misc/Unauthorized';
import { evaluateComplexity, evaluateCosts, evaluateFinancialFigures, evaluateKeyFigureToString, evaluateProject, evaluateProjectPerformance, evaluateProjectRisk, evaluateProjectScope, evaluateStrategy } from './misc/evaluations';

ChartJS.register(ArcElement, Tooltip, Legend);

export const statusDoughnutData = {
  labels: ['Beantragt', 'Genehmigt', 'Abgeschlossen'],
  datasets: [
    {
      label: ' Anzahl',
      data: [1, 2, 3],
      backgroundColor: [
        '#B6C2CC',
        '#7D868C',
        '#393D40'
      ]
    }
  ]
};

export const statusDoughnutOptions = {
  plugins: {
    legend: {
      display: false
    }
  }
};

export class Dashboard extends Component {
  static displayName = Dashboard.name;



  constructor(props) {
    super(props);
    this.state = { projects: [], loading: true };
    this.refreshData = this.refreshData.bind(this);
  }



  componentDidMount() {
    this.populateProjects();
    document.title = "PPM360 | Supernova AG";
  }

  refreshData() {
    this.setState({ loading: true });
    this.populateProjects();
  }

  async populateProjects() {
    try {
      const headers = { 'Authorization': 'Bearer ' + localStorage.getItem("token") };
      const response = await fetch('api/projects', { headers });
      const data = await response.json();
      this.setState({ projects: data, loading: false });
    } catch (error) {
      // Error handling
    }
  }

  static getProjectsCount(projects) {
    var count = Object.keys(projects).length;
    return (count);
  }

  static getTotalCosts(projects) {
    const filteredProjects = projects.filter(project => project.projectStatus === "Genehmigt");
    const totalCost = filteredProjects.reduce((sum, project) => sum + project.budget, 0);
    const formattedCost = Number(totalCost).toLocaleString("de-DE");
    return (formattedCost + " EUR");
  }

  static getAverageProjectScope(projects) {
    const filteredProjects = projects.filter(project => project.projectStatus === "Genehmigt");
    const total = filteredProjects.reduce((sum, project) => sum + evaluateProjectScope(project), 0);
    const average = total / filteredProjects.length;
    return average.toFixed(2);
  }

  static getAverageCosts(projects) {
    const filteredProjects = projects.filter(project => project.projectStatus === "Genehmigt");
    const total = filteredProjects.reduce((sum, project) => sum + evaluateCosts(project), 0);
    const average = total / filteredProjects.length;
    return average.toFixed(2);
  }

  static getAverageStrategy(projects) {
    const filteredProjects = projects.filter(project => project.projectStatus === "Genehmigt");
    const total = filteredProjects.reduce((sum, project) => sum + evaluateStrategy(project), 0);
    const average = total / filteredProjects.length;
    return average.toFixed(2);
  }

  static getAverageProjectRisk(projects) {
    const filteredProjects = projects.filter(project => project.projectStatus === "Genehmigt");
    const total = filteredProjects.reduce((sum, project) => sum + evaluateProjectRisk(project), 0);
    const average = total / filteredProjects.length;
    return average.toFixed(2);
  }

  static getAverageComplexity(projects) {
    const filteredProjects = projects.filter(project => project.projectStatus === "Genehmigt");
    const total = filteredProjects.reduce((sum, project) => sum + evaluateComplexity(project), 0);
    const average = total / filteredProjects.length;
    return average.toFixed(2);
  }

  static getAverageProjectPerformance(projects) {
    const filteredProjects = projects.filter(project => project.projectStatus === "Genehmigt");
    const total = filteredProjects.reduce((sum, project) => sum + evaluateProjectPerformance(project), 0);
    const average = total / filteredProjects.length;
    return average.toFixed(2);
  }

  static getAverageFinancialFigures(projects) {
    const filteredProjects = projects.filter(project => project.projectStatus === "Genehmigt");
    const total = filteredProjects.reduce((sum, project) => sum + evaluateFinancialFigures(project), 0);
    const average = total / filteredProjects.length;
    return average.toFixed(2);
  }


  render() {
    let projectsCount;
    let totalCosts;
    let averageProjectScope;
    let averageCosts;
    let averageStrategy;
    let averageRisk;
    let averageComplexity;
    let averageProjectPerformance;
    let averageFinancialFigures;


    if (this.state.loading) {
      projectsCount = <Skeleton />;
      totalCosts = <Skeleton />;
      averageCosts = <Skeleton />;
      averageComplexity = <Skeleton />;
    } else {
      projectsCount = Dashboard.getProjectsCount(this.state.projects);
      totalCosts = Dashboard.getTotalCosts(this.state.projects);
      averageProjectScope = evaluateKeyFigureToString(Dashboard.getAverageProjectScope(this.state.projects));
      averageCosts = evaluateKeyFigureToString(Dashboard.getAverageCosts(this.state.projects));
      averageStrategy = evaluateKeyFigureToString(Dashboard.getAverageStrategy(this.state.projects));
      averageRisk = evaluateKeyFigureToString(Dashboard.getAverageProjectRisk(this.state.projects));
      averageComplexity = evaluateKeyFigureToString(Dashboard.getAverageComplexity(this.state.projects));
      averageProjectPerformance = evaluateKeyFigureToString(Dashboard.getAverageProjectPerformance(this.state.projects));
      averageFinancialFigures = evaluateKeyFigureToString(Dashboard.getAverageFinancialFigures(this.state.projects));
    }



    const decoded = jwt_decode(localStorage.getItem('token'));
    let userRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    if (userRole !== "Management") return (<Unauthorized />);

    return (
      <div>

        <div className="d-sm-flex align-items-center justify-content-between mt-5 mb-5">
          <h1>Dashboard</h1>

          <div className="d-sm-flex">
            <button className="btn btn-secondary mx-2" onClick={this.refreshData}>
              <FontAwesomeIcon icon={faRotateRight} /> Daten aktualisieren
            </button>
          </div>

        </div>

        <Row>
          <FigureCard heading={"Eingereichte Projektanträge"} content={projectsCount} />
          <FigureCard heading={"Kosten (summiert)"} content={totalCosts} />
          <FigureCard heading={"Ø Projektumfang"} content={averageProjectScope} />
          <FigureCard heading={"Ø Kosten"} content={averageCosts} />
          <FigureCard heading={"Ø Strategie"} content={averageStrategy} />
          <FigureCard heading={"Ø Projektrisiko"} content={averageRisk} />
          <FigureCard heading={"Ø Komplexität"} content={averageComplexity} />
          <FigureCard heading={"Ø Projektleistung"} content={averageProjectPerformance} />
          <FigureCard heading={"Ø Finanzkennzahlen"} content={averageFinancialFigures} />
          <FigureCard heading={"Anzahl Projekte nach Status"} content={<div style={{ width: "75%", margin: "0 auto" }}>
            <Doughnut data={statusDoughnutData} options={statusDoughnutOptions} />
          </div>} />

        </Row>

        <ProjectsOverview />

      </div>
    );
  }
}
