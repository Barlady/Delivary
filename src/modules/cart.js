const cart = () => {

    const buttonCart = document.querySelector('.button-cart');
    const modalCart = document.querySelector('.modal-cart');
    const close = modalCart.querySelector('.close');
    const body = modalCart.querySelector('.modal-body');
    const buttonSend = modalCart.querySelector('.button-primary');
    const buttonCancel = modalCart.querySelector('.clear-cart');
    const sumPrice = modalCart.querySelector('.modal-pricetag');



    const sum = (cartArray) => {
        const res = cartArray.reduce((sum, elem) => (elem.price * elem.count) + sum, 0)
        sumPrice.innerHTML = res + ' ' + '₽'
    }

    const resetCart = () => {
        body.innerHTML = ''
        localStorage.removeItem('cart')
        modalCart.classList.remove('is-open')
    }

    const incrementCount = (id) => {

        const cartArray = JSON.parse(localStorage.getItem('cart'))
        cartArray.map((item) => {
            if (item.id === id) {
                if (item.count > 0) {
                    item.count++
                }
            }
            return item
        })
        localStorage.setItem('cart', JSON.stringify(cartArray))
        renderItems(cartArray)
        sum(cartArray)

    }

    const decrementCount = (id) => {

        const cartArray = JSON.parse(localStorage.getItem('cart'))

        cartArray.map((item) => {
            if (item.id === id) {
                item.count = item.count > 0 ? item.count - 1 : 0
            }
            return item
        })
        localStorage.setItem('cart', JSON.stringify(cartArray))
        renderItems(cartArray)
        sum(cartArray)
    }

    const renderItems = (data) => {
        body.innerHTML = ''
        data.forEach(({ name, price, id, count }) => {
            const cartArray = JSON.parse(localStorage.getItem('cart'))
            const res = cartArray.reduce((sum, elem) => (elem.price * elem.count) + sum, 0)
            sumPrice.innerHTML = res + ' ' + '₽'
            const cartElem = document.createElement('div')
            cartElem.classList.add('food-row')

            cartElem.innerHTML = `
                <span class="food-name">${name}</span>
                <strong class="food-price">${price*count} ₽</strong>
                <div class="food-counter">
                    <button class="counter-button btn-dec" data-index="${id}">-</button>
                    <span class="counter">${count}</span>
                    <button class="counter-button btn-inc" data-index="${id}">+</button>
                </div>
            `
            body.append(cartElem);

        });
    }



    body.addEventListener('click', (event) => {
        event.preventDefault()
        if (event.target.classList.contains('btn-inc')) {
            incrementCount(event.target.dataset.index)
        } else if (event.target.classList.contains('btn-dec')) {
            decrementCount(event.target.dataset.index)
        }

    })

    buttonSend.addEventListener('click', () => {
        const cartArray = localStorage.getItem('cart')

        fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: cartArray
            })
            .then(response => {
                if (response.ok) {
                    resetCart()
                    sumPrice.innerHTML = 0 + ' ' + '₽'
                }
            })
            .catch(e => {
                console.error(e);
            })
    })

    buttonCart.addEventListener('click', () => {
        if (localStorage.getItem('cart')) {
            renderItems(JSON.parse(localStorage.getItem('cart')))
        }
        modalCart.classList.add('is-open');
    })

    close.addEventListener('click', () => {
        modalCart.classList.remove('is-open');
    })

    buttonCancel.addEventListener('click', () => {
        body.innerHTML = ''
        localStorage.removeItem('cart')
        modalCart.classList.remove('is-open')
        sumPrice.innerHTML = 0 + ' ' + '₽'
    })

}

export default cart