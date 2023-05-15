import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import CreateProject from './modals/CreateProject';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { Table } from 'reactstrap';
import Moment from 'moment';

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

    function getProjectIdWithPrefix(projectId, projectType) {
      let prefix;

      switch (projectType) {
        case 'IT-Projekt':
          prefix = 'SAG-IT';
          break;
        case 'Erneuerungsprojekt':
          prefix = 'SAG-ER';
          break;
        case 'Innovationsprojekt':
          prefix = 'SAG-IN';
          break;
        default:
          prefix = 'SAG-X';
          break;
      }
      return `${prefix}-${projectId}`;
    }

    return (

      < Table hover responsive >

        <thead>
          <tr>
            <th>Projekt-ID</th>
            <th>Projektname</th>
            <th>Projektart</th>
            <th>Status</th>
            <th>Verantwortlicher</th>
            <th>Start</th>
            <th>Ende</th>
            <th>Budget</th>
            <th>Teamgröße</th>
            <th>Erstellt am</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project =>
            <tr key={project.id}>
              <td>{getProjectIdWithPrefix(project.id, project.projectType)}</td>
              <td>{project.name}</td>
              <td>{project.projectType}</td>
              <td>{project.projectStatus}</td>
              <td>{project.projectManager}</td>
              <td>{Moment(project.startDate).format('DD.MM.YYYY')}</td>
              <td>{Moment(project.endDate).format('DD.MM.YYYY')}</td>
              <td>{project.budget} EUR</td>
              <td>{project.teamSize}</td>
              <td>{Moment(project.created).format('DD.MM.YYYY')}</td>

            </tr>
          )}
        </tbody>
      </Table >
    );
  }

  static renderLoadingTable() {
    const entries = 10;
    const skeletonEntries = Array.from({ length: entries }).map((_, index) => (
      <tr key={index}>
        <td><Skeleton width={"50%"}/></td>
        <td><Skeleton width={"50%"}/></td>
      </tr>
    ));

    return (
      <Table responsive>
        <thead>
          <tr>
            <th><Skeleton width={"75%"}/></th>
            <th><Skeleton width={"75%"}/></th>
          </tr>
        </thead>
        <tbody>
          {skeletonEntries}
        </tbody>
      </Table>
    );
  }

  render() {
    let contents = this.state.loading
      ? ProjectsOverview.renderLoadingTable()
      : ProjectsOverview.renderProjectsTable(this.state.projects);

    return (
      <div id="wrapper">

        <div className="d-sm-flex align-items-center justify-content-between mt-5 mb-5">
          <h1>Projektanträge</h1>
          <div className="d-sm-flex">
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
    const headers = { 'Authorization': 'Bearer ' + localStorage.getItem("token")};
      const response = await fetch('api/projects', { headers });
    const data = await response.json();
    this.setState({ projects: data, loading: false });
  }
}
