const prompt = document.getElementById('prompt')
const formContainer = document.querySelector('.form-container')
const inventory = document.getElementById('inventory')
let submit = document.querySelector('.submit-btn')
const itemsContainer = document.querySelector('.item-container')
const itemsList = document.querySelector('.item-list')
const clearBtn = document.getElementById('clear-btn')


let editID = '';
let editAction = false;
let editItem;

window.addEventListener('DOMContentLoaded', () => {
    let items = getStorage()

    if (items.length > 0){
        items.forEach(item => {
            listElement(item.id, item.value)
        })
        itemsContainer.classList.add('show-container')
    }
})

formContainer.addEventListener('submit', (d) => {
    d.preventDefault()

    const input = inventory.value
    const itemID = new Date().getTime().toString()
    
    if (input && editAction){
        editItem.textContent = inventory.value
        alertPrompt('item value has been edited', 'success')
        editItemInStorage(editID, input)
        toDefault()
    }
    else if (input && !editAction){
        listElement(itemID, input)
            
        itemsContainer.classList.add('show-container')
        alertPrompt('item addded to list', 'success')
        addItemToStorage(itemID, input)
        toDefault()
    }
    else {
        alertPrompt('empty value', 'danger')
    }
})

const alertPrompt = (text, log) => {
    prompt.textContent = text
    prompt.classList.add(`prompt-${log}`)

    setTimeout(() => {
        prompt.textContent ='';
        prompt.classList.remove(`prompt-${log}`)
    
    },1000)
}

const toDefault = () => {
     editID = '';
     editAction = false;   
     inventory.value = '',
     submit.textContent = 'submit'
}

clearBtn.addEventListener('click', () => {
    const items = document.querySelectorAll('.list-item')
    
    if (items.length > 0){
        items.forEach(item =>{
            itemsList.removeChild(item)
        })
        itemsContainer.classList.remove('show-container')
        alertPrompt('list has been cleared', 'blue')
        localStorage.removeItem('event')
        toDefault()
    }
}) 

const editElement = (e) => {
    const edElement = e.currentTarget.parentElement.parentElement;
    editItem = e.currentTarget.parentElement.previousElementSibling;

    inventory.value = editItem.textContent;
    editID = edElement.dataset.id;
    editAction = true;
    submit.textContent = 'edit'
}

const deleteElement = (c) => {
    const delElement = c.currentTarget.parentElement.parentElement;
    itemsList.removeChild(delElement)
    const itemID = delElement.dataset.id

if (itemsList.children.length == 0){
    itemsContainer.classList.remove('show-container')
}
alertPrompt('item removed', 'danger')
deleteItemFromStorage(itemID)
toDefault()
}


const getStorage = () => {
    return localStorage.getItem('event') ? JSON.parse(localStorage.getItem('event'))
    : []
}

const addItemToStorage = (id, value) => {
    const items = {id, value}
    
    let item = getStorage()
    console.log(item)

    item.push(items)
    localStorage.setItem('event', JSON.stringify(item))
}

const deleteItemFromStorage = (id) => {
    let items = getStorage()

    items = items.filter(item =>{
        if (item.id !== id){
            return item;
        }
    });

    localStorage.setItem('event', JSON.stringify(items))
}

const editItemInStorage = (id, value) => {
    let items = getStorage()

    items = items.map(item => {
        if (item.id === id){
            item.value = value
        }
        return item
    });
    localStorage.setItem('event', JSON.stringify(items))
}


const listElement = (id,value) => {
    const container = document.createElement('article')
        container.classList.add('list-item')

        const attribute = document.createAttribute('data-id')
        attribute.value = id
          
        container.setAttributeNode(attribute)
        container.innerHTML =  `<p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>`

        const editBtn = container.querySelector('.edit-btn')
        const deleteBtn = container.querySelector('.delete-btn')
        
        editBtn.addEventListener('click', editElement)
        deleteBtn.addEventListener('click', deleteElement)

        itemsList.appendChild(container) 
}