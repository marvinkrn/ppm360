import React, { Component } from 'react';
import CreateProject from './modals/CreateProject';

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
    const response = await fetch('api/projects');
    const data = await response.json();
    this.setState({ projects: data, loading: false });
  }

  static getProjectsCount(projects) {
    var count = Object.keys(projects).length;
    return (count);
  }

  static getTotalCosts(projects) {
    const totalCost = projects.reduce((sum, project) => sum + project.budget, 0);
    return (totalCost);
  }

  static getAverageCosts(projects) {
    const totalCost = projects.reduce((sum, project) => sum + project.budget, 0);
    const averageCost = (totalCost / projects.length).toFixed(2);
    const formattedCost = Number(averageCost).toLocaleString("de-DE");
    return (formattedCost);
  }

  render() {
    let projectsCount;
    let totalCosts;
    let averageCosts;

    if (this.state.loading) {
      projectsCount = "Loading...";
      totalCosts = "Loading...";
      averageCosts = "Loading...";
    } else {
      projectsCount = Home.getProjectsCount(this.state.projects);
      totalCosts = Home.getTotalCosts(this.state.projects);
      averageCosts = Home.getAverageCosts(this.state.projects);
    }

    return (
      <div id="wrapper">


        <div class="container-fluid">

          <div class="d-sm-flex align-items-center justify-content-between mt-5 mb-5">
            <h1>Dashboard</h1>

            <div class="d-sm-flex">
              <button className="btn btn-secondary mx-2" onClick={this.refreshData}>
                <i className="fas fa-sync-alt"></i> Daten aktualisieren
              </button>

              <CreateProject/>
            </div>

          </div>

          <div class="row">

            <div class="col-xl-3 col-md-6 mb-4 ">
              <div class="card kpi-card py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col ms-2">
                      <div class="kpi-card-heading">
                        Eingereichte Projektanträge</div>
                      <div class="h5 mb-0 fw-bold">{projectsCount}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4 ">
              <div class="card kpi-card py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col ms-2">
                      <div class="kpi-card-heading">
                        Kosten (summiert)</div>
                      <div class="h5 mb-0 fw-bold">{totalCosts} EUR</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4 ">
              <div class="card kpi-card py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col ms-2">
                      <div class="kpi-card-heading">
                        Durchschnittliche Kosten</div>
                      <div class="h5 mb-0 fw-bold">{averageCosts} EUR</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4 ">
              <div class="card kpi-card py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col ms-2">
                      <div class="kpi-card-heading">
                        KPI 4</div>
                      <div class="h5 mb-0 fw-bold">N/A</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    );
  }
}
