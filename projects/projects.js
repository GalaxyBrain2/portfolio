import { fetchJSON, renderProjects } from '../global.js';

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';


const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
let filteredProj = projects

let selectedIndex = -1;
let selectedLabel = null;

renderProjects(projects, projectsContainer, 'h2');

const projectsTitle = document.querySelector('.projects-title');
if (projectsTitle) {
    projectsTitle.textContent = `${projects.length} Projects`;
}
//Pie Chart
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

function renderPieChart(projectsGiven){

    let newRolledData = d3.rollups(projectsGiven,(v) => v.length, (d) => d.year);

    let newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year };
    });
    if (selectedLabel !== null) {
        const newIdx = newData.findIndex(d => d.label === selectedLabel);
        selectedIndex = newIdx !== -1 ? newIdx : -1;
    }
    
    let newSliceGenerator = d3.pie().value((d) => d.value);

    let newArcData = newSliceGenerator(newData);

    let newArcs = newArcData.map((d) => arcGenerator(d));

    let svg = d3.select('svg');
    let legend = d3.select('.legend');
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    svg.selectAll('path').remove();
    legend.selectAll('li').remove();
 

    newArcs.forEach((arc, idx) => {
        svg
          .append('path')
          .attr('d', arc) 
          .attr('fill', colors(idx))
          .on('click', () => {
            if (selectedIndex === idx) {
                selectedIndex = -1;
                selectedLabel = null;
              } else {
                selectedIndex = idx;
                selectedLabel = newData[idx].label;
              }
              filteredProj = projects.filter((project) => {
                const values = Object.values(project).join('\n').toLowerCase();
                const matchesQuery = values.includes(query.toLowerCase());
                const matchesYear = selectedLabel === null || project.year === selectedLabel;
                return matchesQuery && matchesYear;
              });
              renderProjects(filteredProj, projectsContainer, 'h2');          
            svg
                .selectAll('path')
                .attr('class', (_, idx) => (
                    idx === selectedIndex ? 'selected' : ''
            ));
            legend
                .selectAll('li')
                .attr('class', (_, idx) => (
                    idx === selectedIndex ? 'selected' : ''
            ));
          });
        
    });

    

    newData.forEach((d, idx) => {
   legend
     .append('li')
     .attr('style', `--color:${colors(idx)}`) 
     .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); 
});
    legend
    .selectAll('li')
    .attr('class', (_, idx) => (
        idx === selectedIndex ? 'selected' : ''
    ));

}

renderPieChart(filteredProj);

let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
    query = event.target.value;

    filteredProj = projects.filter((project) => {
        let vals = Object.values(project).join('\n').toLowerCase();
        let matchesQuery = vals.includes(query.toLowerCase());
        let matchesYear = selectedLabel === null || project.year === selectedLabel;
        return matchesQuery && matchesYear;
    })
    

    renderProjects(filteredProj, projectsContainer, 'h2');
    if (selectedLabel === null) {
        renderPieChart(filteredProj);
    }
  });
