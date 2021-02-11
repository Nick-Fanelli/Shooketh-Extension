const TableBody = document.querySelector("table tbody");
const EditModel = document.getElementById("editModel");
const EditModelName = document.querySelector("#editModel input");
const Span = document.getElementsByClassName("close")[0];

var extensionData = {
    "Group 1": [
        "https://google.com",
        "https://thereal.com"
    ]
};

function onEdit() {
    EditModel.style.display = "block";
    EditModelName.value = "test";
}

Span.onclick = function() {
    EditModel.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == EditModel) {
    EditModel.style.display = "none";
  }
}

function loadExtensionData() {

}

function formatExtensionData() {
    var returnData = "";

    for(const group in extensionData) {
        let groupName = group;
        let groupSites = extensionData[group];

        var groupHTML = `
        <tr>
            <td>${groupName}</td>
            <td sitesArray="${groupSites}">
                <button class="open-btn">Open</button>
                <button class="edit-btn" onclick="onEdit()">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        </tr>
        `;

        returnData += groupHTML;
    }

    return returnData;
}

loadExtensionData();
let htmlData = formatExtensionData();

TableBody.innerHTML += htmlData;