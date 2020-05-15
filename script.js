//* Eetorna o comando para constante!
const sel = (el) => document.querySelector(el);
const all = (el) => document.querySelectorAll(el);

// mapeia as pizzas e realiza uma operation
pizzaJson.map((pizza, index) => {
    // clona elemento e seu conteudo
    let pizzaItem = sel('.models .pizza-item').cloneNode(true);
    
    // adiciona img
    pizzaItem.querySelector('.pizza-item--img img').src = pizza.img;

    // preenche as infos em pizza-item
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${pizza.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = pizza.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = pizza.description;

    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();

        sel('.pizzaWindowArea').style.opacity = 0;
        sel('.pizzaWindowArea').style.display = 'flex';
        // faz efeito suave
        setTimeout(() => {
            sel('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    sel('.pizza-area').append(pizzaItem);
});