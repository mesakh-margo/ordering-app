import { menuArray } from '/data.js'
const order = {}

const paymentForm = document.getElementById('payment-form')
paymentForm.addEventListener('submit', function(e) {
    e.preventDefault()
    const inputs = e.target.querySelectorAll('input[required]')
    let formValid = true

    e.target.querySelectorAll('.error-message').forEach(msg => msg.remove())

    inputs.forEach(input => {
        const value = input.value.trim()
        const pattern = input.getAttribute('pattern')

        if (!value) {
            formValid = false
            showError(input, 'This field is required')
        } else if (pattern && !(new RegExp(`^${pattern}`)).test(value)) {
            formValid = false
            showError(input, 'Invalid format')
        }
    })
    
    const modalInner = document.querySelector('.modal-inner')
    if (formValid) {
        modalInner.innerHTML = `
            <div class="payment-success">
                <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c5 5 11.8 7.5 18.8 7s13.4-4.1 17.5-9.8L379.3 179.2c7.8-10.7 5.4-25.7-5.3-33.5z"/></svg>
                <h2>Payment successful!</h2>
                <p>Thank you for your order. Your delicious food is being prepared.</p>
                <button id="close-btn">Close</button>
            </div>
        `
    }
})


document.addEventListener('click', function(e) {
    if (e.target.dataset.add) {
        const itemId = Number(e.target.dataset.add)
        order[itemId] = (order[itemId] || 0) + 1
        render()
    }
    
    if (e.target.dataset.remove) {
        const itemId = Number(e.target.dataset.remove)
        if (order[itemId]) {
            order[itemId]--
            if (order[itemId] === 0) delete order[itemId]
            render()
        }
    }

    if (e.target.id === 'complete-order-btn') {
        document.querySelector('.modal').classList.add('show')
    }

    
    if (e.target.id === 'payment-modal') {
        document.querySelector('.modal').classList.remove('show')
        if (document.querySelector('#close-btn')){
            orderSuccess()
        }
    }

    if (e.target.id === 'close-btn') {
        const modal = document.querySelector('.modal')
        modal.classList.remove('show')
        orderSuccess()
    }
})

function orderSuccess() {
    document.querySelector('.main').innerHTML = `
        <img
        class="gif"
        src="images/cooking.gif"
        alt="delicious food"
        >
    `
}

function getMenuHtml() {
    return menuArray.map(menu => `
        <div class="menu-item">
            <div class="menu-image">
                <img src="${menu.image}">
            </div>  
            <div class="menu-desc">
                <h2>${menu.name}</h2>
                <p>${menu.ingredients.join(', ')}</p>
                <h3>$${menu.price}</h3>
            </div>
            <div class="options">
                <span class="option remove">
                    <i class="fa-solid fa-minus" data-remove="${menu.id}"></i>
                </span>
                <span class="option count" data-count="${menu.id}">
                    ${order[menu.id] || 0}
                </span>
                <span class="option add">
                    <i class="fa-solid fa-plus" data-add="${menu.id}"></i>
                </span>
            </div>
        </div>
    `).join('')
}

function getOrderSummaryHtml() {
    const entries = Object.entries(order)
    if (entries.length === 0) return ``

    const ordersHtml = entries.map(([id, qty]) => {
        const menu = menuArray.find(menu => menu.id === Number(id))
        return `
            <span class="order-item">
                <h2>x${qty} ${menu.name}</h2>
                <h3>$${menu.price * qty}</h3>
            </span>
        `
    }).join('')

    const totalPrice = entries.reduce((sum, [id, qty]) => {
        const menu = menuArray.find(menu => menu.id === Number(id))
        return sum + menu.price * qty
    }, 0)

    return `
        <div class="order">
            <h2>Your Order</h2>
            ${ordersHtml}
        </div>
        <div class="total-price">
            <h2>Total price:</h2>
            <h3>$${totalPrice}</h3>
        </div>
        <button id="complete-order-btn">Complete Order</button>
    `
}

function showError(input, message) {
    const errorEl = document.createElement('div')
    errorEl.classList.add('error-message')
    errorEl.textContent = message
    input.insertAdjacentElement('afterend', errorEl)
}

function render() {
    document.getElementById("menu-section").innerHTML = `${getMenuHtml()}`
    document.getElementById("order-section").innerHTML = `${getOrderSummaryHtml()}`
}

render()
