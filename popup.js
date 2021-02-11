const SyncSaveLocation = "shooketh_tab-group-data";

const TableBody = document.querySelector("table tbody");
const EditModel = document.getElementById("editModel");
const EditModelName = document.querySelector("#editModel input");
const Span = document.getElementsByClassName("close");
const NewGroupButton = document.getElementById("new-btn");

var extensionData = {

};
// Extension Data Loading and Saving

function saveExtensionData() {
    // Save on Chrome Sync Data
    chrome.storage.sync.clear();
    chrome.storage.sync.set({ "shooketh_tab-group-data": extensionData }, function() {
        console.log("Save Extension Data")
    })
    loadExtensionData();
}

function loadExtensionData() {
    chrome.storage.sync.get("shooketh_tab-group-data", function(result) {
        extensionData = result["shooketh_tab-group-data"];
        console.log(extensionData);

        let htmlData = formatExtensionData();
        TableBody.innerHTML = htmlData;
        bindButtonCallbacks();
    });
}

// Popup Functions

function createGroup(name, sites) {
    saveExtensionData();
}

function editGroup() {
    EditModel.style.display = "block";
    EditModelName.value = "test";
    saveExtensionData();
}

function deleteGroup(group) {

    let parentElement = group.parentElement.parentElement;
    let groupName = group.parentElement.getAttribute("groupNameData");

    let confirmation = confirm(`Are you sure you want to delete '${groupName}'! You will be shook!`);

    if(confirmation) {
        // Delete from extension json data
        delete extensionData[groupName];

        parentElement.innerHTML = "";
    }

    saveExtensionData();
}

Span.onclick = function() {
    EditModel.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == EditModel) {
    EditModel.style.display = "none";
  }
}

NewGroupButton.onclick = function() {
    let groupName = window.prompt("Please Enter New Shook-eth Group Name", "Prepare to be shook!");

    if(groupName != null && groupName != "") {
        if(extensionData[groupName] != undefined) {
            alert(`You already have a group named '${groupName}' silly! You wouldn't want the computer to get shook!`);
            return;
        }

        extensionData[groupName] = "";
    }

    saveExtensionData();
}

function formatExtensionData() {
    var returnData = "";

    for(const group in extensionData) {
        let groupName = group;
        let groupSites = extensionData[group];

        var groupHTML = `
        <tr>
            <td>${groupName}</td>
            <td groupNameData="${groupName}" sitesArray="${groupSites}">
                <button class="open-btn">Open</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        </tr>
        `;

        returnData += groupHTML;
    }

    return returnData;
}

function bindButtonCallbacks() {
    // Delete Callbacks
    document.querySelectorAll(".delete-btn").forEach(
        item => {
            item.addEventListener("click", event => {
                deleteGroup(item);
            });
        }
    );
}

// On Popup Startup Code
loadExtensionData();
// saveExtensionData();

// saveExtensionData()
// alert("Hello World");