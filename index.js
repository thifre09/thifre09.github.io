document.addEventListener('DOMContentLoaded', (event) => {
    // Carrega as notas do localStorage quando a página é carregada
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteContainer = document.getElementById('noteContainer');
    savedNotes.forEach(noteText => {
        const note = document.createElement('div');
        note.className = 'note';
        note.innerHTML = `
            <textarea readonly>${noteText}</textarea>
            <button class="edit" onclick="editNote(this)">Editar</button>
            <button class="delete" onclick="deleteNote(this)">Excluir</button>
        `;
        noteContainer.appendChild(note);
    });
});

function addNote() {
    const noteText = document.getElementById('newNoteText').value;
    if (noteText.trim() === '') return;

    const noteContainer = document.getElementById('noteContainer');
    const note = document.createElement('div');
    note.className = 'note';

    note.innerHTML = `
        <textarea readonly>${noteText}</textarea>
        <button class="edit" onclick="editNote(this)">Editar</button>
        <button class="delete" onclick="deleteNote(this)">Excluir</button>
    `;

    noteContainer.appendChild(note);
    document.getElementById('newNoteText').value = '';

    // Salva a nova nota no localStorage
    saveNotes();
}

function editNote(button) {
    const note = button.parentElement;
    const textarea = note.querySelector('textarea');

    if (button.textContent === 'Editar') {
        textarea.removeAttribute('readonly');
        button.textContent = 'Salvar';
    } else {
        textarea.setAttribute('readonly', '');
        button.textContent = 'Editar';

        // Salva as alterações no localStorage
        saveNotes();
    }
}

function deleteNote(button) {
    const note = button.parentElement;
    note.remove();

    // Salva as alterações no localStorage
    saveNotes();
}

function saveNotes() {
    const noteContainer = document.getElementById('noteContainer');
    const notes = Array.from(noteContainer.children).map(note => note.querySelector('textarea').value);
    localStorage.setItem('notes', JSON.stringify(notes));
}