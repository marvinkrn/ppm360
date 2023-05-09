import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import CreateProject from './modals/CreateProject';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';

export class ProjectsOverview extends Component {
  static displayName = ProjectsOverview.name;

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

  static renderProjectsTable(projects) {
    return (
      <table className="table table-striped" aria-labelledby="tableLabel">
        <thead>
          <tr>
            <th>UPID</th>
            <th>Projektname</th>
            <th>Budget</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project =>
            <tr key={project.id}>
              <td>SAG-IT-{project.id}</td>
              <td>{project.name}</td>
              <td>{project.budget} EUR</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  static renderLoadingTable() {
    const entries = 15;
    const skeletonEntries = Array.from({ length: entries }).map((_, index) => (
      <tr key={index}>
        <td><Skeleton /></td>
        <td><Skeleton /></td>
      </tr>
    ));

    return (
      <table className="table table-striped" aria-labelledby="tableLabel">
        <thead>
          <tr>
            <th>UPID</th>
            <th>Projektname</th>
          </tr>
        </thead>
        <tbody>
          {skeletonEntries}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
      ? ProjectsOverview.renderLoadingTable()
      : ProjectsOverview.renderProjectsTable(this.state.projects);

    return (
      <div id="wrapper">

        <div class="d-sm-flex align-items-center justify-content-between mt-5 mb-5">
          <h1>Projektanträge</h1>
          <div class="d-sm-flex">
            <button className="btn btn-secondary mx-2" onClick={this.refreshData}>
              <FontAwesomeIcon icon={faRotateRight} /> Daten aktualisieren
            </button>
            <CreateProject />
          </div>

        </div>

        {contents}

      </div>
    );
  }

  async populateProjects() {
    const response = await fetch('api/projects');
    const data = await response.json();
    this.setState({ projects: data, loading: false });
  }
}
