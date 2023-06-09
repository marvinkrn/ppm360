import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircleQuestion, faCircleXmark, faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { Table } from 'reactstrap';
import Moment from 'moment';
import { getProjectIdWithPrefix } from './misc/helper';

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

    function getProjectStatus(status) {
      switch (status) {
        case 'Beantragt':
          return <div className='ppm360-cell' style={{ backgroundColor: "#fef5e7", color: "#f39c12" }}>
            <FontAwesomeIcon icon={faFileInvoice} /> {status}
          </div>;
        case 'Genehmigt':
          return <div className='ppm360-cell' style={{ backgroundColor: "#e8f6ef", color: "#27ae60" }}>
            <FontAwesomeIcon icon={faCheckCircle} /> {status}
          </div>;
        case 'Abgelehnt':
          return <div className='ppm360-cell' style={{ backgroundColor: "#f9ebea", color: "#e74c3c" }}>
            <FontAwesomeIcon icon={faCircleXmark} /> {status}
          </div>;
        case 'Abgeschlossen':
          return <div className='ppm360-cell' style={{ backgroundColor: "#f3f5f5", color: "#737e93" }}>
            <FontAwesomeIcon icon={faCheckCircle} /> {status}
          </div>;
        default:
          return <div className='ppm360-cell' style={{ backgroundColor: "#f3f5f5", color: "#737e93" }}>
            <FontAwesomeIcon icon={faCircleQuestion} /> {"Unbekannt: " + status}
          </div>;
      }
    }

    return (

      <Table hover responsive >
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
          </tr>
        </thead>
        <tbody>
          {projects.map(project =>
            <tr key={project.id}>
              <td>{getProjectIdWithPrefix(project.id, project.projectType, project.responsibleLocation)}</td>
              <td>{project.name}</td>
              <td>{project.projectType}</td>
              <td>{getProjectStatus(project.projectStatus)}</td>
              <td>{project.projectManager}</td>
              <td>{Moment(project.startDate).format('DD.MM.YYYY')}</td>
              <td>{Moment(project.endDate).format('DD.MM.YYYY')}</td>
              <td>{project.budget} EUR</td>
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
        <td><Skeleton width={"50%"} /></td>
        <td><Skeleton width={"50%"} /></td>
      </tr>
    ));

    return (
      <Table responsive>
        <thead>
          <tr>
            <th><Skeleton width={"75%"} /></th>
            <th><Skeleton width={"75%"} /></th>
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
        </div>

        {contents}

      </div>
    );
  }

  async populateProjects() {
    const headers = { 'Authorization': 'Bearer ' + localStorage.getItem("token") };
    const response = await fetch('api/projects', { headers });
    const data = await response.json();
    this.setState({ projects: data, loading: false });
  }
}
