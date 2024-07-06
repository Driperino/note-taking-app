const API_URL = "http://localhost:3000"


async function getNotes() {
    try {
        const response = await fetch(`${API_URL}/notes`)
        const data = await response.json()
        console.log(data)

        //Area IDs
        const noteTitle = document.getElementById('noteTitle')
        const contentArea = document.getElementById('noteContent')

        if (data.length) {
            console.log(data[0].title, data[0].content)
            noteTitle.value = data[0].title
            contentArea.innerHTML = data[0].content
        } else {
            noteTitle.innerHTML = "Click the 'New Note' button to create a new note"
            contentArea.innerHTML = "Sad Note Taking App noises..."
            console.log("No notes found")

        }
    } catch (error) {
        console.error('Error fetching notes:', error)
    }
}


addEventListener("DOMContentLoaded", async () => {
    await getNotes()
})

//Expanding menus 
document.getElementById('menuButton').addEventListener('click', function () {
    var menu = document.getElementById('menu');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
    } else {
        menu.classList.add('hidden');
    }
});

document.getElementById('notesButton').addEventListener('click', function () {
    var notesMenu = document.getElementById('notesMenu');
    if (notesMenu.classList.contains('hidden')) {
        notesMenu.classList.remove('hidden');
    } else {
        notesMenu.classList.add('hidden');
    }
});

