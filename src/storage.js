function getProjects() {
  if (localStorage.myProject === undefined || localStorage.myProject === '[]') {
    return [{ title: "Default Project", selected: true, todos: [] }];
  }
  return JSON.parse(localStorage.getItem('myProject'));
}

function setProjects(projects){
    localStorage.setItem('myProject', JSON.stringify(projects));
}

export {getProjects, setProjects}