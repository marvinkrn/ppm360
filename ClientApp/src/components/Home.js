import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import CreateProject from './modals/CreateProject';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateRight } from '@fortawesome/free-solid-svg-icons'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const statusDoughnutData = {
  labels: ['Beantragt', 'Genehmigt', 'Abgeschlossen'],
  datasets: [
    {
      label: ' Anzahl',
      data: [19, 8, 4],
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

export class Home extends Component {
  static displayName = Home.name;

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
      const response = await fetch('api/projects');
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
      projectsCount = Home.getProjectsCount(this.state.projects);
      totalCosts = Home.getTotalCosts(this.state.projects);
      averageCosts = Home.getAverageCosts(this.state.projects);
    }



    return (
      <div id="wrapper">

        <div class="d-sm-flex align-items-center justify-content-between mt-5 mb-5">
          <h1>Dashboard</h1>

          <div class="d-sm-flex">
            <button className="btn btn-secondary mx-2" onClick={this.refreshData}>
              <FontAwesomeIcon icon={faRotateRight} /> Daten aktualisieren
            </button>
            <CreateProject />
          </div>

        </div>

        <div class="row">

          <div class="col-xl-3 col-md-6 mb-4">
            <div class="card kpi-card p-2">
              <div class="card-body">
                <div class="kpi-card-heading">Eingereichte Projektanträge</div>
                <div class="h5 mb-0 fw-bold">{projectsCount}</div>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6 mb-4">
            <div class="card kpi-card p-2">
              <div class="card-body">
                <div class="kpi-card-heading">Kosten (summiert)</div>
                <div class="h5 mb-0 fw-bold">{totalCosts}</div>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6 mb-4">
            <div class="card kpi-card p-2">
              <div class="card-body">
                <div class="kpi-card-heading">Durchschnittliche Kosten</div>
                <div class="h5 mb-0 fw-bold">{averageCosts}</div>
              </div>
            </div>
          </div>


          <div class="col-xl-3 col-md-6 mb-4">
            <div class="card kpi-card p-2">
              <div class="card-body">
                <div class="kpi-card-heading"><Skeleton /></div>
                <div class="h5 mb-0 fw-bold"><Skeleton width={"50%"} /></div>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6 mb-4">
            <div class="card kpi-card p-2">
              <div class="card-body">
                <div class="kpi-card-heading"><Skeleton /></div>
                <div class="h5 mb-0 fw-bold"><Skeleton width={"50%"} /></div>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6 mb-4">
            <div class="card kpi-card p-2">
              <div class="card-body">
                <div class="kpi-card-heading"><Skeleton /></div>
                <div class="h5 mb-0 fw-bold"><Skeleton width={"50%"} /></div>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6 mb-4">
            <div class="card kpi-card p-2">
              <div class="card-body">
                <div class="kpi-card-heading"><Skeleton /></div>
                <div class="h5 mb-0 fw-bold"><Skeleton width={"50%"} /></div>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-md-6 mb-4">
            <div class="card kpi-card p-2">
              <div class="card-body">
                <div class="kpi-card-heading"><Skeleton /></div>
                <div class="h5 mb-0 fw-bold"><Skeleton width={"50%"} /></div>
              </div>
            </div>
          </div>

          <div class="col-xl-3">
            <div class="card kpi-card p-2">
              <div class="card-body">
                <div class="kpi-card-heading">Anzahl Projekte nach Status</div>
                {/*<Skeleton height={200} /> */}
                <div style={{ width: "75%", margin: "0 auto" }}>
                  <Doughnut data={statusDoughnutData} options={statusDoughnutOptions} />
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>



    );
  }
}
