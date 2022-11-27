import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.scss';
import axios from 'axios';
const apiPath = 'http://localhost:8080/items/';

window.allItems = new Map();
axios.interceptors.request.use(request => {
    console.log('Starting Request', JSON.stringify(request, null, 2))
    return request
})
axios.interceptors.response.use(response => {
    console.log('Starting Response', JSON.stringify(response.data, null, 2))
    return response;
})
populateIssueBoard();

function getNextIdForTheItem() {
    return getDomElementFromId(Date.now()); //it is possible for this thing to fail
}

function getDomElementFromId(id) {
    return 'item-' + id;
}

function deleteItemOnServer(itemId) {
    axios.delete(apiPath + itemId.replace('item-', '')).then(res => console.log(res));
}

function getItemsFromServer() {
    axios.get(apiPath).then(res => initializeItems(res.data));
}

function postItemOnServer(itemId) {
    axios.post(apiPath + itemId.replace('item-', ''), allItems.get(itemId)).then(res => console.log(res));
}

function initializeItems(jsonItems) {
    jsonItems.forEach(item => {
        console.log(item);
        const issueState = {
            itemName: item.itemName,
            assignedColumn: item.assignedColumn,
            estimatedEffort: item.estimatedEffort,
            loggedEffort: item.loggedEffort,
            assignedTo: item.assignedTo
        };
        const id = getDomElementFromId(item.id);
        allItems.set(id, issueState);

        const itemDomElement = createCardItem();
        assignIdToTheItem(itemDomElement, id);
        addEventListenersForDropdownMenuOfTheItem(itemDomElement);
        addDraggingBetweenColumnsForItem(itemDomElement);
        fillCard(itemDomElement, issueState);
        displayCard(itemDomElement);
        const column = document.getElementById(item.assignedColumn);

        column.appendChild(itemDomElement);
    });
}

function populateIssueBoard() {
    initializeColumns();
    getItemsFromServer();
    // Primary Events
    onClickAddNewItemToTheColumn();
    onAddEditModalSubmitFillCurrentlyEditedItemWithInputs();
    onLogHoursModalSubmitUpdateHours();
    onColumnDragoverAddItemToThisColumn();
    // Secondary Events
    onModalClosureClearItsInputs();
    onInputFocusClearValueFromTheInput();
}

function onClickAddNewItemToTheColumn() {
    document.querySelectorAll('.add-item-button')
        .forEach(button => button.addEventListener('click', event => addNewItem(event)));
}

function onAddEditModalSubmitFillCurrentlyEditedItemWithInputs() {
    document.querySelector('.add-modify-item-form')
        .addEventListener('submit', event => fillCurrentlyEditedItemWithModalInputs(event));
}

function onLogHoursModalSubmitUpdateHours() {
    document.querySelector('.log-hours-form')
        .addEventListener('submit', event => updateHoursFromLogHoursModal(event));
}

function onColumnDragoverAddItemToThisColumn() {
    document.querySelectorAll('.state-issues')
        .forEach(column => column
            .addEventListener('dragover', event => processItemDraggedOverColumn(event, column)));
}

function onModalClosureClearItsInputs() {
    document.querySelectorAll('.modal')
        .forEach(itemModal => itemModal
            .addEventListener('hidden.bs.modal', () => document.querySelector('form').reset()));
}

function onInputFocusClearValueFromTheInput() {
    document.querySelectorAll('form')
        .forEach(f => f.querySelectorAll('input')
            .forEach(i => i.addEventListener('focus',
                event => event.target.value = '')));
}


function initializeColumns() {
    let mainRow = document.querySelector('.main-row');
    let column = document.querySelector('.state-column');
    setNameAndIds(column, 'New');

    const deepCopy = true;
    let columnClone1 = column.cloneNode(deepCopy);
    setNameAndIds(columnClone1, 'In Progress');
    let columnClone2 = column.cloneNode(deepCopy);
    setNameAndIds(columnClone2, 'In Review');
    let columnClone3 = column.cloneNode(deepCopy);
    setNameAndIds(columnClone3, 'Done');
    mainRow.appendChild(columnClone1);
    mainRow.appendChild(columnClone2);
    mainRow.appendChild(columnClone3);
}

function processItemDraggedOverColumn(event, column) {
    event.preventDefault();

    const draggedItem = getCurrentlyEditedItem();
    const itemAfter = getItemDirectlyAfter(column, event.clientY);

    itemAfter === null ? column.appendChild(draggedItem) : column.insertBefore(draggedItem, itemAfter);
    const elem = allItems.get(draggedItem.id);
    elem.assignedColumn = column.id;
}

function getItemDirectlyAfter(column, positionY) {
    const items = [...column.querySelectorAll('.issue:not(.currently-edited)')];
    return items.reduce((closestItem, currentItem) => {
            const itemBoundaries = currentItem.getBoundingClientRect();
            const offset = positionY - itemBoundaries.top - itemBoundaries.height / 2;
            if(offset < 0 && offset > closestItem.offset) return { item: currentItem, offset: offset };
            return closestItem;
        },
        {item: null, offset: Number.NEGATIVE_INFINITY}).item;
}

function setNameAndIds(columnElement, columnName) {
    columnElement.querySelector('#column-name').textContent = columnName;
    const idName = changeColumnToIdName(columnName);
    columnElement.querySelector('.state-issues').id = idName + '-column';
}

function changeColumnToIdName(columnName) {
    return columnName.toLowerCase().replace(' ', '-');
}

function assignIdToTheItem(item, id) {
    item.id = id;
}

function addNewItem(event) {
    const item = createCardItem();
    assignIdToTheItem(item, getNextIdForTheItem())
    addStatusOfCurrentlyEditedToItem(item);
    addEventListenersForDropdownMenuOfTheItem(item);
    addDraggingBetweenColumnsForItem(item);

    const column = event.target.closest('.state-column').querySelector('.state-issues')
    column.appendChild(item);

    formatAddAndEditModal('Add New Item', {
        itemName: null,
        estimatedEffort: null,
        loggedEffort: 0,
        assignedTo: null,
    });
}

function createCardItem() {
    const item = document.createElement('div');
    const itemClassList = ['card', 'issue', 'p-2', 'm-2', 'd-none'];
    item.classList.add(...itemClassList);
    item.setAttribute('draggable', 'true');
    item.innerHTML = createItemDomElementTemplate();
    return item;
}

function createItemDomElementTemplate() {
    return `
      <div class="container p-0">
        <div class="d-flex flex-row justify-content-between">
          <div class="col-11 issue-name">
            <span id="item-name"></span>
          </div>
          <div class="col-1 menu text-end">
            <div class="dropdown">
              <i class="p-0 fa-solid fa-ellipsis meatballs-menu" 
                type="button" data-bs-toggle="dropdown" aria-expanded="false"></i>
              <ul class="dropdown-menu internal-issue-menu">
                <li><a class="dropdown-item" id="log-hours" 
                    href="#" data-bs-toggle="modal" data-bs-target="#log-hours-modal">Log Hours</a></li>
                <li><a class="dropdown-item" id="edit-item" 
                    href="#" data-bs-toggle="modal" data-bs-target="#add-edit-item-modal">Edit</a></li>
                <li><a class="dropdown-item" id="delete-item" 
                    href="#">Delete Item</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="d-flex flex-row justify-content-between hours">
          <div class="col">
            Estimated Hours: 
            <span id="estimated-time"></span>
          </div>
          <div class="col text-end">
            Logged Hours: 
            <span id="logged-time"></span>
          </div>
        </div>
        <div class="d-flex flex-row justify-content-between other">
          <div class="col text-end">
            Assigned to: 
            <span id="assigned-to"></span>
          </div>
        </div>
      </div>`;
}

function addEventListenersForDropdownMenuOfTheItem(item) {
    item.querySelector('#log-hours').addEventListener('click', event => logHoursToItem(event));
    item.querySelector('#edit-item').addEventListener('click', event => editExistingItemState(event));
    item.querySelector('#delete-item').addEventListener('click', event => deleteItem(event));
}

function getItemIdForDropdownButton(buttonDomElement) {
    return buttonDomElement.closest('.issue');
}

function logHoursToItem(event) {
    const item = getItemIdForDropdownButton(event.target);
    addStatusOfCurrentlyEditedToItem(item);
    const itemValues = allItems.get(item.id);
    const logHoursModal = document.querySelector('#log-hours-modal');
    logHoursModal.querySelector('.initial-estimate').textContent = itemValues.estimatedEffort;
    logHoursModal.querySelector('.name-to-log-to').textContent = itemValues.itemName;
    logHoursModal.querySelector('.already-logged').textContent = itemValues.loggedEffort;
}

function getItemForDropdownButton(domElement) {
    return domElement.closest('.issue');
}

function editExistingItemState(event) {
    const item = getItemForDropdownButton(event.target);
    addStatusOfCurrentlyEditedToItem(item);
    const currentlyEditedItem = {id: item.id,
                                 value: allItems.get(item.id)};
    formatAddAndEditModal('Edit Item', currentlyEditedItem.value);
}

function deleteItem(event) {
    const item = getItemIdForDropdownButton(event.target);
    deleteItemOnServer(item.id);
    allItems.delete(item.id);
    item.outerHTML = '';
}

function getCurrentlyEditedItem() {
    return document.querySelector('.currently-edited');
}

function addStatusOfCurrentlyEditedToItem(item) {
    item.classList.add('currently-edited');
}

function removeStatusOfCurrentlyEditedFromItem(item) {
    item.classList.remove('currently-edited');
}

function addDraggingBetweenColumnsForItem(item) {
    item.addEventListener('dragstart', () => addStatusOfCurrentlyEditedToItem(item));
    item.addEventListener('dragend', () => {
        removeStatusOfCurrentlyEditedFromItem(item);
        postItemOnServer(item.id);});
}

function getInputFormTargetById(targetElem, idName) {
    return targetElem.querySelector('#' + idName).value;
}

function formatAddAndEditModal(mode, itemState) {
    const modal = document.querySelector('#add-edit-item-modal');
    modal.querySelector('.modal-mode-name').textContent = mode;
    fillInputsWithFieldsFromState(modal, itemState);
}

function fillInputsWithFieldsFromState(modal, itemState) {
    modal.querySelector('#issue-name-input').value = itemState.itemName;
    modal.querySelector('#estimated-time-input').value = itemState.estimatedEffort;
    modal.querySelector('#effort-logged-input').value = itemState.loggedEffort;
    modal.querySelector('#assigned-to-input').value = itemState.assignedTo;
}

function displayCard(cardDomElement) {
    cardDomElement.classList.remove('d-none');
}

function fillCurrentlyEditedItemWithModalInputs(event) {
    const inputs = getInputsFromForm(event.target);
    const card = getCurrentlyEditedItem();
    inputs.assignedColumn = card.closest('.state-issues').id;
    fillCard(card, inputs);
    displayCard(card);

    const item = { id: card.id, inputs: inputs };
    updateItemList(item);
    postItemOnServer(item.id);
    removeStatusOfCurrentlyEditedFromItem(card);
    event.preventDefault();
}

function fillCard(card, inputs) {
    card.querySelector('#item-name').textContent = inputs.itemName;
    card.querySelector('#estimated-time').textContent = inputs.estimatedEffort;
    card.querySelector('#logged-time').textContent = inputs.loggedEffort;
    card.querySelector('#assigned-to').textContent = inputs.assignedTo;
}

function getInputsFromForm(form) {
    return {
        itemName: getInputFormTargetById(form, 'issue-name-input'),
        estimatedEffort: parseInt(getInputFormTargetById(form, 'estimated-time-input')),
        loggedEffort: parseInt(getInputFormTargetById(form, 'effort-logged-input')),
        assignedTo: getInputFormTargetById(form, 'assigned-to-input')
    };
}

function updateItemList(item) {
    allItems.set(item.id, item.inputs);
}

function updateHoursFromLogHoursModal(event) {
    const item = getCurrentlyEditedItem();
    const editedItem = allItems.get(item.id);
    editedItem.loggedEffort += parseInt(event.target.querySelector('#hours-to-log').value);
    item.querySelector('#logged-time').textContent = editedItem.loggedEffort;
    postItemOnServer(item.id);
    removeStatusOfCurrentlyEditedFromItem(item);
    event.preventDefault();
}