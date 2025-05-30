import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

// Get the base URL dynamically
const baseUrl = location.hostname === 'galaxybrain2.github.io' ? '/portfolio' : '';
const projects = await fetchJSON(`${baseUrl}/lib/projects.json`);
const latestProjects = projects.slice(0, 3);
const projectsContainer = document.querySelector('.projects');
if (projectsContainer) {
    renderProjects(latestProjects, projectsContainer, 'h2');
  }

const githubData = await fetchGitHubData('RyanCao2005');
const profileStats = document.querySelector('#profile-stats');
if (profileStats) {
    profileStats.innerHTML = `
          <dl>
            <dt>Followers:</dt><dd>${githubData.followers}</dd>
            <dt>Following:</dt><dd>${githubData.following}</dd>
            <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
            <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
            
          </dl>
      `;
  }
