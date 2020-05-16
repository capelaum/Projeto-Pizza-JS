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

    sel('.pizza-area').append(pizzaItem);
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
    
    // selected size
    let size = parseInt( sel('.pizzaInfo--size.selected').getAttribute('data-key') );

    // id@size - identifier 
    let identifier = pizzaJson[modalKey].id + '@' + size;

    //* Return -1: if doesnt find an index with the same identifier 
    let key = cart.findIndex((item) => item.identifier == identifier);
    console.log('key = ' + key);

    // Pushing to Cart..
    if(key > -1) {
        cart[key].qtd += modalQt;   //* updates qtd only if it's already in cart
    }else{
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qtd: modalQt
        });
    }


    closeModal();

});