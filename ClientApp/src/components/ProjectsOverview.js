import React, { Component } from 'react';

export class ProjectsOverview extends Component {
  static displayName = ProjectsOverview.name;

  constructor(props) {
    super(props);
    this.state = { projects: [], loading: true };
  }

  componentDidMount() {
    this.populateProjects();
  }

  static renderForecastsTable(projects) {
    return (
      <table className="table table-striped" aria-labelledby="tableLabel">
        <thead>
          <tr>
            <th>ID</th>
            <th>Projektname</th>
            <th>Erwartete Kosten</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project =>
            <tr key={project.id}>
              <td>{project.id}</td>
              <td>{project.name}</td>
              <td>{project.budget} EUR</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : ProjectsOverview.renderForecastsTable(this.state.projects);

    return (
      <div>
        <div class="d-sm-flex align-items-center justify-content-between mt-5 mb-5">
          <h1 id="tableLabel">Eingereichte Projektanträge</h1>
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
