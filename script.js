const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const dropZone = document.getElementById("dropZone");
const fileTable = document.getElementById("fileTable");
const fileCount = document.getElementById("fileCount");
const searchInput = document.getElementById("searchInput");
const notification = document.getElementById("notification");
const viewAllBtn = document.getElementById("viewAllBtn");

let totalFiles = 24;

// Open file selector
uploadBtn.addEventListener("click", () => {
fileInput.click();
});

// Files selected
fileInput.addEventListener("change", (event) => {
handleFiles(event.target.files);
});

// Drag over
dropZone.addEventListener("dragover", (event) => {
event.preventDefault();
dropZone.classList.add("dragover");
});

// Drag leave
dropZone.addEventListener("dragleave", () => {
dropZone.classList.remove("dragover");
});

// Drop files
dropZone.addEventListener("drop", (event) => {
event.preventDefault();

dropZone.classList.remove("dragover");

const files = event.dataTransfer.files;
handleFiles(files);


});

// Handle uploaded files
function handleFiles(files) {
if (files.length === 0) {
return;
}

Array.from(files).forEach((file) => {
    addFileToTable(file);
    totalFiles++;
});

fileCount.textContent = totalFiles;

showNotification(
    `${files.length} file${files.length > 1 ? "s" : ""} uploaded successfully!`
);


}

// Add file to table
function addFileToTable(file) {
const row = document.createElement("tr");

const extension = getExtension(file.name);
const type = getFileType(extension);
const size = formatFileSize(file.size);

row.innerHTML = `
    <td>📄 ${escapeHTML(file.name)}</td>
    <td>${type}</td>
    <td>${size}</td>
    <td>Just now</td>
    <td>
        <button class="more-btn" onclick="deleteFile(this)">⋮</button>
    </td>
`;

fileTable.prepend(row);


}

// Get extension
function getExtension(fileName) {
const parts = fileName.split(".");
return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

// Get readable file type
function getFileType(extension) {
const types = {
pdf: "PDF",
jpg: "Image",
jpeg: "Image",
png: "Image",
gif: "Image",
doc: "Document",
docx: "Document",
txt: "Text",
xls: "Excel",
xlsx: "Excel",
ppt: "PowerPoint",
pptx: "PowerPoint",
zip: "Archive",
rar: "Archive"
};

return types[extension] || "File";


}

// Format file size
function formatFileSize(bytes) {
if (bytes === 0) {
return "0 Bytes";
}

const units = ["Bytes", "KB", "MB", "GB"];
const index = Math.floor(Math.log(bytes) / Math.log(1024));

return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;


}

// Delete file
function deleteFile(button) {
const row = button.closest("tr");

row.remove();

totalFiles--;
fileCount.textContent = totalFiles;

showNotification("File removed.");


}

// Search files
searchInput.addEventListener("input", () => {
const searchTerm = searchInput.value.toLowerCase();

const rows = fileTable.querySelectorAll("tr");

rows.forEach((row) => {
    const fileName = row.cells[0].textContent.toLowerCase();

    if (fileName.includes(searchTerm)) {
        row.style.display = "";
    } else {
        row.style.display = "none";
    }
});


});

// View all button
viewAllBtn.addEventListener("click", () => {
const rows = fileTable.querySelectorAll("tr");

rows.forEach((row) => {
    row.style.display = "";
});

searchInput.value = "";

showNotification("Showing all available files.");


});

// Notification
function showNotification(message) {
notification.textContent = message;
notification.classList.add("show");

setTimeout(() => {
    notification.classList.remove("show");
}, 2500);


}

// Prevent HTML injection in uploaded file names
function escapeHTML(text) {
const div = document.createElement("div");
div.textContent = text;
return div.innerHTML;
}