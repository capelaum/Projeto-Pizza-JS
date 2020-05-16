//* Encapsulate the Selectors comands
const sel = (el) => document.querySelector(el);
const all = (el) => document.querySelectorAll(el);

let cart = []; 
let modalKey = 0;
let modalQt = 1;   

// Pizza maping ant listing
pizzaJson.map((pizza, index) => {
    // clones the pizza item and content
    let pizzaItem = sel('.models .pizza-item').cloneNode(true);
    
    // Generate an attribute data-key to the pizza-item
    pizzaItem.setAttribute('data-key', index);

    // Pizza itens info 
    pizzaItem.querySelector('.pizza-item--img img').src = pizza.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${pizza.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = pizza.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = pizza.description;

    // Show Modal Event
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();

        //* Get the pizza key
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalKey = key;
        modalQt = 1;    // reset pizza qtd 

        sel('.pizzaBig img').src = pizzaJson[key].img;
        sel('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        sel('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        sel('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

        // remove selected size item
        sel('.pizzaInfo--size.selected').classList.remove('selected');
        all('.pizzaInfo--size').forEach((size, sizeIndex) => {
            //* big size selected!
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        sel('.pizzaInfo--qt').innerHTML = modalQt;

        sel('.pizzaWindowArea').style.opacity = 0;
        sel('.pizzaWindowArea').style.display = 'flex';

        // faz efeito suave
        setTimeout(() => {
            sel('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    sel('.pizza-area').append(pizzaItem);   // insert pizzaItem
});

//* Modal events
function closeModal() {
    sel('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        sel('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

// Array of 2 Cancel Buttons
all('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((btn) => {
    btn.addEventListener('click', closeModal);
});

// seting the qt buttons
sel('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if(modalQt > 1){
        modalQt--;
        sel('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

// max = 50 pizzas
sel('.pizzaInfo--qtmais').addEventListener('click', () => {
    if(modalQt < 50){
        modalQt++;
        sel('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

// select size
all('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        // reset
        sel('.pizzaInfo--size.selected').classList.remove('selected');  

        // add
        size.classList.add('selected');
    })
});

//* Add to Cart 
sel('.pizzaInfo--addButton').addEventListener('click', () => {
    
    // get selected size
    let size = parseInt( sel('.pizzaInfo--size.selected').getAttribute('data-key') );

    // id@size = identifier 
    let identifier = pizzaJson[modalKey].id + '@' + size;

    //* Return -1: if doesn't find an index with the same identifier 
    let key = cart.findIndex((item) => item.identifier == identifier);

    // Pushing to Cart..
    if(key > -1) {
        cart[key].qt += modalQt;   //* updates quantity only if it's already in cart
    }else{
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }
    updateCart();
    closeModal();
});

//* Updates Cart 
function updateCart(){
    
    if(cart.length > 0) {
        sel('aside').classList.add('show');
        sel('.cart').innerHTML = '';    // resets the cart to update

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            // find the object pizza from cart
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = sel('.models .cart--item').cloneNode(true);
            
            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                }else {
                    cart.splice(i, 1);
                }
                updateCart();
            });

            sel('.cart').append(cartItem);
        }// end for in cart[]

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        sel('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        sel('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        sel('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    
    }else {

        sel('aside').classList.remove('show');
    }
}