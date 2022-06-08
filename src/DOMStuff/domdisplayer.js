// import moment from 'moment';
// import { project } from '../createObjects';
import { setProjects } from '../storage.js';

const projList = document.querySelector('#listOfProjs');

function addProj(projects, project){
    const li = document.createElement('li');
    const link = document.createElement('a');
    const i = document.createElement('i');

    li.classList.add('nav-item');
    i.classList.add('bx', 'bxs-trash', 'iGarb');

    link.textContent = project.title;
    link.classList.add('nav-link', 'projGrapper');
    link.setAttribute('id', `${project.title}`);
    link.ariaCurrent = 'page';
    link.href = '#';
    link.addEventListener('click', function(){
         showThemAll(projects, project);
    })

    i.addEventListener('click', function(){
        if(confirm('Are you sure?')){
            removeProject(projects, project);
        }
    });

    li.appendChild(link);
    li.appendChild(i);
    
    projList.appendChild(li);
    for(let proj of projects){
        if(!proj.selected && document.getElementById(proj.title)){
            document.getElementById(proj.title).style.color = "#989FCE";
        }if(proj.selected && document.getElementById(proj.title)){
            document.getElementById(proj.title).style.color = "#fff";
        }
        
    }
}

function addTask(projects, proj, task){
    const lu = document.querySelector('#todoList');
    const li = document.createElement('li');
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    const div3 = document.createElement('div');
    const input = document.createElement('input');
    const i1 = document.createElement('i');
    const i2 = document.createElement('i');
    const i3 = document.createElement('i');

    li.classList.add('list-group-item', `priority${task.priority}`);
    input.classList.add('form-check-input', 'me-1');
    input.type = 'checkbox';
    input.value = '';
    input.ariaLabel = "...";
    input.checked = task.done;
    input.addEventListener('click', function(){
        if(task.done){
            task.done = false;
        }else{
            task.done = true;
        }
    });


    


    div1.appendChild(input);
    div1.appendChild(document.createTextNode(task.title));
    div2.classList.add('todoIcons');
    
    if(task.dueDate !== 'Invalid date'){
        div3.textContent = task.dueDate;
    }else{
        div3.textContent = '';
    }

    if(task.priority){
        i1.classList.add('bx', 'bxs-star', 'iFav');
    }else{
        i1.classList.add('bx', 'bx-star', 'iFav');
    }
    i2.classList.add('bx', 'bx-trash', 'iGarb');
    i3.classList.add('bx', 'bx-edit', 'iEdit');
    i3.setAttribute('data-bs-toggle','modal'); 
    i3.setAttribute('data-bs-target','#editTaskModal');
    i1.addEventListener('click', function(){
        if(task.priority){
            i1.classList.remove('bxs-star');
            i1.classList.add('bx-star');
            task.priority = false; 
        }else{
            i1.classList.remove('bx-star');
            i1.classList.add('bxs-star');
          task.priority = true;  
        }
        
        
        prioritizeTask(projects, proj);
    });
    i2.addEventListener('click', function(){
        if(confirm('Are you sure?')){
            removeTask(projects, proj, task)
        };
    });

    i3.addEventListener('click', function(){
        document.querySelector('#editTaskTitle').value = task.title;
        if(document.querySelector('#editTaskTitle').classList[1]){
            document.querySelector('#editTaskTitle').classList.remove(document.querySelector('#editTaskTitle').classList[1],
            document.querySelector('#editTaskTitle').classList[2]);
        }
        document.querySelector('#editDate').value = '';
        document.querySelector('#editTaskTitle').setAttribute('name1', task.title.trim());
        document.querySelector('#editTaskTitle').setAttribute('name', proj.title.trim());
        document.querySelector('#editTaskDescp').value = task.description;
        if(task.priority){
            document.querySelector('#editPriority').checked = true;
        }else{
            document.querySelector('#editPriority').checked = false;
        }if(task.done){
            document.querySelector('#editDone').checked = true;
        }else{
            document.querySelector('#editDone').checked = false;
        }
        
    });

    div2.appendChild(i1);
    div2.appendChild(i3);
    div2.appendChild(i2);

    li.appendChild(div1);
    li.appendChild(div3);
    li.appendChild(div2);
    lu.appendChild(li);

}

function init(projects){
    const title = document.querySelector('#projectName');
    for(let proj of projects){
        addProj(projects, proj);
        title.textContent = `${proj.title} tasks`;
        if(proj.selected){
            for(let tasks of proj.todos){
                addTask(projects, proj, tasks);
            }
            document.getElementById(proj.title).style.color = '#fff';
        }
    }
    
}

function showThemAll(projects, proj){
    const lu = document.querySelector('#todoList');
    const projName = document.querySelector('#projectName');

    projName.textContent = `${proj.title} tasks`;
    for(let x of projects){
        if(x.selected){
            document.getElementById(x.title).style.color = "#989FCE";
            x.selected = false;
            document.getElementById(proj.title).style.color = "#fff";
            proj.selected = true;
        }
    }

    while(lu.firstChild){
        lu.removeChild(lu.firstChild);
    }

    for(let task of proj.todos){
        addTask(projects, proj, task);
    }
     
}

function removeTask(projects, proj, task){

    for(let x in proj.todos){
        if(proj.todos[x].title === task.title){
            proj.todos.splice(x, 1);
            showThemAll(projects, proj);
            break;
        }
    }
    setProjects(projects);
}

function updateProjects(projects, proj){
    const lu = document.querySelector('#listOfProjs');
    const lu1 = document.querySelector('#todoList');
    const projName = document.querySelector('#projectName');
    let selected;
    projName.textContent = `There are no projects`;

    while(lu.firstChild){
        lu.removeChild(lu.firstChild);
    }
    if(projects.length > 0){
        projName.textContent = `${proj.title} tasks`;

        for(let projs of projects){
            if(projs.selected){
                selected = projs;
            }
            addProj(projects, projs);
        }
        showThemAll(projects, selected);
    }else{
        while(lu1.firstChild){
            lu1.removeChild(lu1.firstChild);
        }
    }


}

function removeProject(projects, proj){
    for(let x in projects){
        if(projects[x].title === proj.title){
            projects.splice(x, 1);
            setProjects(projects);
            for(let projs of projects){
                if(projs.selected){
                    updateProjects(projects, projs);
                    return;
                }
            }
            if(projects.length > 0){
                projects[0].selected = true;
                updateProjects(projects, projects[0]);
                break;
            }
            updateProjects(projects, {});
            break;
        }
    }
}

function prioritizeTask(projects, proj){
    let aux, organized = false, aux1 = false;

    while(!organized){
        for(let x = 0; x <= proj.todos.length - 2 ; x++){
            if(!proj.todos[x].priority && proj.todos[x+1].priority ){
                aux = proj.todos[x];
                proj.todos[x] = proj.todos[x+1];
                proj.todos[x+1] = aux;
                
            }
        }
        organized = true;
        for(let tasks of proj.todos){
            if(!tasks.priority){
               aux1 = true;
            }if(tasks.priority && aux1){
               organized = false;
               aux1 = false;
               break;
            }
       }
    }

    showThemAll(projects, proj);
    
}

export {addProj, addTask, showThemAll, init, prioritizeTask};