const socket = io()

const clientsTotal = document.getElementById('clients-total')

var messageContainer = document.getElementById('message-container')
var nameInput = document.getElementById('name-input')
var messageForm = document.getElementById('message-form')
var messageInput = document.getElementById('message-input')

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
})

socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total Clients: ${data}`
})

function sendMessage(){
    if(messageInput.value == '') return
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    }
    socket.emit('message', data)
    addMessageToUI(true, data)
    messageInput.value = ''
}

socket.on('chat-message', (data) => {
    addMessageToUI(false, data)
})


function addMessageToUI(isOwnMessage, data){

    var time = new Date(data.dateTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    const element = `
            <li class="${isOwnMessage ?"message-right" :"message-left"}">
                <p class="message">
                    ${data.message}
                    <span>${data.name} ● ${time}</span>
                </p>
            </li>
            `

    messageContainer.innerHTML += element
    scrollToBottom()
}

function scrollToBottom(){
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}