import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import CreateProject from './modals/CreateProject';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateRight } from '@fortawesome/free-solid-svg-icons'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from "react-chartjs-2";
import FigureCard from './misc/FigureCard';
import { Row } from 'reactstrap';

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
    const totalCost = projects.reduce((sum, project) => sum + project.budget, 0);
    const formattedCost = Number(totalCost).toLocaleString("de-DE");
    return (formattedCost + " EUR");
  }

  static getAverageCosts(projects) {
    const totalCost = projects.reduce((sum, project) => sum + project.budget, 0);
    const averageCost = (totalCost / projects.length).toFixed(2);
    const formattedCost = Number(averageCost).toLocaleString("de-DE");
    return (formattedCost + " EUR");
  }

  render() {
    let projectsCount;
    let totalCosts;
    let averageCosts;

    if (this.state.loading) {
      projectsCount = <Skeleton />;
      totalCosts = <Skeleton />;
      averageCosts = <Skeleton />;
    } else {
      projectsCount = Dashboard.getProjectsCount(this.state.projects);
      totalCosts = Dashboard.getTotalCosts(this.state.projects);
      averageCosts = Dashboard.getAverageCosts(this.state.projects);
    }



    return (
      <div>

        <div className="d-sm-flex align-items-center justify-content-between mt-5 mb-5">
          <h1>Dashboard</h1>

          <div className="d-sm-flex">
            <button className="btn btn-secondary mx-2" onClick={this.refreshData}>
              <FontAwesomeIcon icon={faRotateRight} /> Daten aktualisieren
            </button>
            <CreateProject />
          </div>

        </div>

        <Row>
          <FigureCard heading={"Eingereichte Projektanträge"} content={projectsCount} />
          <FigureCard heading={"Kosten (summiert)"} content={totalCosts} />
          <FigureCard heading={"Durchschnittliche Kosten"} content={averageCosts} />
          <FigureCard heading={<Skeleton />} content={<Skeleton width={"50%"} />} />
          <FigureCard heading={<Skeleton />} content={<Skeleton width={"50%"} />} />
          <FigureCard heading={<Skeleton />} content={<Skeleton width={"50%"} />} />
          <FigureCard heading={<Skeleton />} content={<Skeleton width={"50%"} />} />
          <FigureCard heading={<Skeleton />} content={<Skeleton width={"50%"} />} />
          <FigureCard heading={"Anzahl Projekte nach Status"} content={<div style={{ width: "75%", margin: "0 auto" }}>
            <Doughnut data={statusDoughnutData} options={statusDoughnutOptions} />
          </div>} />
        </Row>

      </div>
    );
  }
}
