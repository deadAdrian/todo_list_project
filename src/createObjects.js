function project(title){
    const todos = [];
    const selected = false;
    return {title, selected, todos};
}

function todo(title, description, dueDate, priority, done){
    return {title, description, dueDate, priority, done};
}

export {project, todo};