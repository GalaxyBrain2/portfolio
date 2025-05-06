import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

async function loadData() {
    const data = await d3.csv('loc.csv', (row) => ({
      ...row,
      line: Number(row.line), // or just +row.line
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + 'T00:00' + row.timezone),
      datetime: new Date(row.datetime),
    }));
  
    return data;
  }
  function processCommits(data) {
    return d3
      .groups(data, (d) => d.commit)
      .map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;
        let ret = {
          id: commit,
          url: 'https://github.com/vis-society/lab-7/commit/' + commit,
          author,
          date,
          time,
          timezone,
          datetime,
          hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
          totalLines: lines.length,
        };
  
        Object.defineProperty(ret, 'lines', {
            value: lines,
            // What other options do we need to set?
            // Hint: look up configurable, writable, and enumerable
            enumerable: false, 
            writable: false,    
            configurable: false 
        });
  
        return ret;
      });
  }

  function renderCommitInfo(data, commits) {
    // Create the dl element
    const dl = d3.select('#stats').append('dl').attr('class', 'stats');
  
    // Add total LOC
    dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
    dl.append('dd').text(data.length);
  
    // Add total commits
    dl.append('dt').text('Total commits');
    dl.append('dd').text(commits.length);
  
    // Number of files
    const files = d3.groups(data, d => d.file);
    const numFiles = files.length;
    // Max file length and longest file
    const fileLengths = d3.rollups(
        data,
        v => d3.max(v, d => d.line),
        d => d.file
    );

    const [longestFile, maxLines] = d3.greatest(fileLengths, d => d[1]);

    // Add number of files
    dl.append('dt').text('Number of files');
    dl.append('dd').text(numFiles);

    // Add maximum file length
    dl.append('dt').text('Maximum file length');
    dl.append('dd').text(maxLines);

    // Add longest file name
    dl.append('dt').text('Longest file');
    dl.append('dd').text(longestFile);
  }
  
  let data = await loadData();
  let commits = processCommits(data);
  
  renderCommitInfo(data, commits);