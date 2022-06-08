import {addProj, showThemAll, init, prioritizeTask} from './domdisplayer.js';
import {project, todo} from '../createObjects.js';
import { getProjects, setProjects } from '../storage.js';
import moment from 'moment';

//let newProj = project('Teste');
//let todo = todo('Teste', 'Função de teste', '20-03-2022', true, true);



export default function app(){
    const projects = getProjects();
    const projectSelector = document.getElementsByClassName('projGrapper');
    const myModal1 = new bootstrap.Modal(document.querySelector('#projModal'));
    const myModal2 = new bootstrap.Modal(document.querySelector('#taskModal'));
    const myModal3 = new bootstrap.Modal(document.querySelector('#editTaskModal'));
    const btnAddProj = document.querySelector('#btnAddProj');
    const btnAddTask = document.querySelector('#btnAddTask');
    const btnEditTask = document.querySelector('#btnEditTask');
    const inputProjTitle = document.querySelector('#inputProjTitle');
    const inputTaskTitle = document.querySelector('#inputTaskTitle');
    const inputTaskDescp = document.querySelector('#inputTaskDescp');
    const inputDueDate = document.querySelector('#dueDate'); inputDueDate.min = moment().format(moment.HTML5_FMT.DATE);
    document.querySelector('#editDate').min = moment().format(moment.HTML5_FMT.DATE);
    const checkPriority = document.querySelector('#checkPriority');
    const checkDone = document.querySelector('#checkDone');

    init(projects);

    btnAddProj.addEventListener('click', function(){
        
        
        let newProj = project(inputProjTitle.value);

        if(newProj.title !== '' && thereIsProject(newProj.title)){
            
            for(let proj of projects){
                if(proj.selected){
                    proj.selected = false;
                    break;
                }
            }
            newProj.selected = true;
            projects.push(newProj);
            addProj(projects, newProj);
            myModal1.hide();
            

            
            showThemAll(projects, newProj);
        }else{
            alert('You must give your project a unique name.');
        }
        inputProjTitle.value = '';
        setProjects(projects);
    });

    btnAddTask.addEventListener('click', function(){
        let projSelected;

        for(let proj of projects){
            if(proj.selected){
                projSelected = proj;
            }
        }
        
        if(projects.length>0){
            if(taskValidator() && thereIsTask(projSelected, inputTaskTitle.value.trim())){
                let todoToAdd = todo(inputTaskTitle.value.trim(), inputTaskDescp.value, moment(inputDueDate.value).format('DD/MM/YYYY'),
                    checkPriority.checked, checkDone.checked);
    
                projSelected.todos.push(todoToAdd);
                myModal2.hide();
                prioritizeTask(projects, projSelected);
    
    
                inputTaskTitle.value = '';
                inputTaskDescp.value = '';
                inputDueDate.value = '';
                checkPriority.checked = false;
                checkDone.checked = false;
            }else{
                alert('You must give your task a unique name and a description.');
            }
        }else{
            alert('You must have a project to add a task.');
        }
        
        
        setProjects(projects);
    });

    btnEditTask.addEventListener('click', function(){
        for(let proj of projects){
            if(proj.title === document.querySelector('#editTaskTitle').getAttribute('name')){
               for(let tasks of proj.todos){
                    if(tasks.title === document.querySelector('#editTaskTitle').getAttribute('name1') && editValidator() && thereIsEditTask(proj,tasks, document.querySelector('#editTaskTitle').value.trim())){
                        tasks.title = document.querySelector('#editTaskTitle').value.trim();
                        tasks.priority = document.querySelector('#editPriority').checked;
                        tasks.done = document.querySelector('#editDone').checked;
                        tasks.dueDate = moment(document.querySelector('#editDate').value).format('DD/MM/YYYY')
                        tasks.description = document.querySelector('#editTaskDescp').value;
                        prioritizeTask(projects, proj);
                        myModal3.hide();
                        setProjects(projects);
                        return;
                    }
                } 
            }
            
        }
        
        alert('You must give your task a unique name and a description.');
    });

    function taskValidator(){
        if(inputTaskTitle.value === '' || inputTaskDescp.value === ''){
            return false;
        }
        return true;
    }

    function editValidator(){
        if(document.querySelector('#editTaskTitle').value === '' || document.querySelector('#editTaskDescp').value === ''){
            
            
            return false;
        }
        return true;
    }

    function thereIsProject(titleo){
        for(let x of projects){
            if(x.title == titleo){
                return false;
            }
        }
        return true;
    }

    function thereIsTask(proj,titleo){
        for(let task of proj.todos){
            if(task.title === titleo){
                return false;
            }
        }
        
        return true;
    }

    function thereIsEditTask(proj, task, titleo){
        for(let tasks of proj.todos){
            if(tasks.title === titleo && tasks.title !== task.title){
                return false;
            }
        }
        
        return true;
    }
}






