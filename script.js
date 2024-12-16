const files = [
    { id: 1, name: "document1.txt", type: "txt" },
    { id: 2, name: "image1.jpg", type: "jpg" },
    { id: 3, name: "presentation1.ppt", type: "ppt" },
    { id: 4, name: "spreadsheet1.xlsx", type: "xlsx" },
    { id: 5, name: "document2.txt", type: "txt" },
];

const fileIcons = {
    txt: "📄",
    jpg: "🖼️",
    ppt: "📊",
    xlsx: "📈",
    default: "📁",
};

let bin = [];
let history = {};
let sortAsc = true;
let currentFiles = [];

function categorizeFiles() {
    const folderContainer = document.getElementById("folderContainer");
    folderContainer.innerHTML = "";
    const folders = {};

    files.forEach(file => {
        if (!folders[file.type]) folders[file.type] = [];
        folders[file.type].push(file);
    });

    for (const type in folders) {
        const folder = document.createElement("div");
        folder.className = "folder";
        folder.innerText = `${fileIcons[type] || fileIcons.default} ${type}`;
        folder.onclick = () => displayFiles(folders[type]);
        folderContainer.appendChild(folder);
    }
}

function displayFiles(filesToShow) {
    currentFiles = filesToShow;
    const fileContainer = document.getElementById("fileContainer");
    fileContainer.innerHTML = "";

    filesToShow.forEach(file => {
        const fileDiv = document.createElement("div");
        fileDiv.className = "file";
        fileDiv.innerHTML = `${fileIcons[file.type] || fileIcons.default}<br>${file.name.split('.')[0]}`;
        fileDiv.onclick = () => editFile(file);
        fileContainer.appendChild(fileDiv);
    });
}

function searchFiles() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const filteredFiles = currentFiles.filter(file => file.name.toLowerCase().includes(searchTerm));
    displayFiles(filteredFiles);
}

function toggleSort() {
    sortAsc = !sortAsc;
    currentFiles.sort((a, b) => {
        return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });
    displayFiles(currentFiles);
}

function editFile(file) {
    const newName = prompt("Enter new file name:", file.name);
    if (newName) {
        recordHistory(file);
        file.name = newName;
        displayFiles(currentFiles);
    }
}

function recordHistory(file) {
    if (!history[file.id]) history[file.id] = [];
    history[file.id].push({ name: file.name, date: new Date().toLocaleString() });
}

function displayHistory(file) {
    const modal = document.getElementById("historyModal");
    const content = document.getElementById("historyContent");
    content.innerHTML = "";

    if (history[file.id]) {
        history[file.id].forEach(record => {
            const div = document.createElement("div");
            div.innerText = `${record.name} (Edited: ${record.date})`;
            content.appendChild(div);
        });
    } else {
        content.innerText = "No history available.";
    }

    modal.style.display = "block";
}

function closeModal() {
    document.getElementById("historyModal").style.display = "none";
}

function moveToBin(file) {
    bin.push(file);
    files.splice(files.indexOf(file), 1);
    categorizeFiles();
    displayFiles(currentFiles);
    displayBin();
}

function displayBin() {
    const binContainer = document.getElementById("binContainer");
    binContainer.innerHTML = "";

    bin.forEach(file => {
        const fileDiv = document.createElement("div");
        fileDiv.className = "bin-file";
        fileDiv.innerText = file.name;
        fileDiv.onclick = () => restoreFromBin(file);
        binContainer.appendChild(fileDiv);
    });
}

function restoreFromBin(file) {
    files.push(file);
    bin.splice(bin.indexOf(file), 1);
    categorizeFiles();
    displayBin();
}

function clearBin() {
    if (confirm("Are you sure you want to clear the bin?")) {
        bin = [];
        displayBin();
    }
}

// Initial call
categorizeFiles();
