const input = document.querySelector('.task-input');
const addBtn = document.querySelector('.add-btn');
const pendingList = document.querySelector('#pending-list');
const completedList = document.querySelector('#completed-list');

function getTime() {
  return new Date().toLocaleString();
}

function createTaskElement(taskText, isCompleted = false, time = getTime()) {
  let text = taskText; 
  let createdTime = time;

  const task = document.createElement('div');
  task.className = 'task';

  const textDiv = document.createElement('div');
  textDiv.className = 'task-text';
  textDiv.innerHTML = `<div class="task-content">${escapeHtml(text)}</div><div class="task-time">${createdTime}</div>`;

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const completeBtn = document.createElement('button');
  completeBtn.className = 'action-btn complete-btn';
  completeBtn.textContent = isCompleted ? 'Undo' : 'Done';

  const editBtn = document.createElement('button');
  editBtn.className = 'action-btn edit-btn';
  editBtn.textContent = 'Edit';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'action-btn delete-btn';
  deleteBtn.textContent = 'Del';

  actions.append(completeBtn, editBtn, deleteBtn);
  task.append(textDiv, actions);

  
  completeBtn.onclick = () => {
    task.remove();
    if (isCompleted) {
      pendingList.appendChild(createTaskElement(text, false));
    } else {
      completedList.appendChild(createTaskElement(text, true));
    }
  };

 
  editBtn.onclick = () => {
    
    const editor = document.createElement('div');
    editor.className = 'task-editor';

    const editInput = document.createElement('input');
    editInput.className = 'edit-input';
    editInput.type = 'text';
    editInput.value = text;

    const saveBtn = document.createElement('button');
    saveBtn.className = 'action-btn save-btn';
    saveBtn.textContent = 'Save';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'action-btn cancel-btn';
    cancelBtn.textContent = 'Cancel';

    editor.append(editInput, saveBtn, cancelBtn);

    
    const timeHtml = `<div class="task-time">${createdTime}</div>`;
    textDiv.innerHTML = '';
    textDiv.appendChild(editor);
    textDiv.insertAdjacentHTML('beforeend', timeHtml);

    editInput.focus();
    editInput.select();

    
    const saveHandler = () => {
      const newText = editInput.value.trim();
      if (newText === '') {
        
        alert('Task cannot be empty.');
        editInput.focus();
        return;
      }
      text = newText;
      createdTime = getTime();
      textDiv.innerHTML = `<div class="task-content">${escapeHtml(text)}</div><div class="task-time">${createdTime}</div>`;
    };

    
    const cancelHandler = () => {
      textDiv.innerHTML = `<div class="task-content">${escapeHtml(text)}</div><div class="task-time">${createdTime}</div>`;
    };

    saveBtn.onclick = saveHandler;
    cancelBtn.onclick = cancelHandler;

    
    editInput.addEventListener('keydown', function ke(e) {
      if (e.key === 'Enter') {
        saveHandler();
        editInput.removeEventListener('keydown', ke);
      } else if (e.key === 'Escape') {
        cancelHandler();
        editInput.removeEventListener('keydown', ke);
      }
    });
  };

  deleteBtn.onclick = () => task.remove();

  return task;
}


addBtn.onclick = () => {
  const value = input.value.trim();
  if (value) {
    pendingList.appendChild(createTaskElement(value));
    input.value = '';
  }
};


input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addBtn.click();
});


function escapeHtml(str) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
