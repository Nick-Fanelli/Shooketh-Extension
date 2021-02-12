const SyncSaveLocation = "shooketh_tab-group-data";

const TableBody = document.querySelector("table tbody");
const EditModel = document.getElementById("editModel");
const EditModelName = document.querySelector("#editModel input");

const CloseButton = document.getElementById("close");
const NewGroupButton = document.getElementById("new-btn");

var extensionData = {};

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

var currentGroup;

function openGroup(group) {
    var tabsToGroup = [];

    chrome.tabs.create({url: "https://www.google.com", active: false});
    chrome.tabs.create({url: "https://www.google.com", active: false});

    chrome.tabs.query({active:false}, tabs => {
        tabsToGroup.push(tabs[tabs.length - 1]);
        tabsToGroup.push(tabs[tabs.length - 2]);

        var tabIdGroups = [];

        for(let i = 0; i < tabsToGroup.length; i++) {
            tabIdGroups.push(tabsToGroup[i].id);
        }

        chrome.tabs.group({tabIds: tabIdGroups});
    });

}

function editGroup(group) {
    currentGroup = group;

    let parentElement = group.parentElement.parentElement;
    let groupName = group.parentElement.getAttribute("groupNameData");

    EditModel.style.display = "block";
    EditModelName.value = groupName;
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

function saveEditedGroupData() {
    let previousGroupName = currentGroup.parentElement.getAttribute("groupNameData");
    let groupName = EditModelName.value;

    if(previousGroupName != groupName) {
        if(extensionData[groupName] != undefined) {
            window.alert(`The group name '${groupName}' already exists silly! You wouldn't want the computer to get shook!`);
            return;
        }

        extensionData[groupName] = extensionData[previousGroupName];
        delete extensionData[previousGroupName];
    }

    EditModel.style.display = "none";
    saveExtensionData();
}

// Edit Popup Functions

CloseButton.onclick = function() {
    saveEditedGroupData();
}

window.onclick = function(event) {
    if (event.target == EditModel) {
        saveEditedGroupData();
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

    // Edit Callbacks
    document.querySelectorAll(".edit-btn").forEach(
        item => {
            item.addEventListener("click", event => {
                editGroup(item);
            });
        }
    );

    // Open Callbacks
    document.querySelectorAll(".open-btn").forEach(
        item => {
            item.addEventListener("click", event => {
                openGroup(item);
            });
        }
    );
}

// On Popup Startup Code
loadExtensionData();