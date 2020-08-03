import './style.css'
import { isValid, createModal } from './utils'
import { Question } from './question'
import { getAuthForm } from './auth'
import { authWithEmailAndPassword } from './auth'

const form = document.getElementById('form')
const modal = document.getElementById('modal-btn')
const input = form.querySelector('#question-input')
const submitBtb = form.querySelector('#submit')

window.addEventListener('load', Question.renderList())

form.addEventListener('submit', submitFormHandler)
modal.addEventListener('click', openModal)
input.addEventListener('input', () => {
    submitBtb.disabled = !isValid(input.value)
})

function submitFormHandler(event) {
    event.preventDefault()

    if (isValid(input.value)) {
        const question = {
            text: input.value.trim(),
            date: new Date().toJSON()
        }
        submitBtb.disabled = true

        //Async request to server to save question
        Question.create(question).then(() => {
            input.value = ''
            input.className = ''
            submitBtb.disabled = false
        })
    }
}

function openModal() {
    createModal('Авторизация', getAuthForm())
    document.getElementById('auth-form').addEventListener('submit', authFormHandler, {once: true})
}

function authFormHandler(event) {
    event.preventDefault()

    const email = event.target.querySelector('#email').value
    const password = event.target.querySelector('#password').value

    authWithEmailAndPassword(email, password)
    .then(Question.fetch)
    .then(renderModalAfterAuth)
}

function renderModalAfterAuth(content) {

    if(typeof content === 'string'){
        createModal('ошибка', content)
    } else {
        createModal('Список вопросов', Question.listToHtml(content))
    }
    console.log(content)
}
