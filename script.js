//* Eetorna o comando para constante!
const sel = (el) => document.querySelector(el);
const all = (el) => document.querySelectorAll(el);

// mapeia as pizzas e realiza listagem
pizzaJson.map((pizza, index) => {
    // clona elemento e seu conteudo
    let pizzaItem = sel('.models .pizza-item').cloneNode(true);
    
    // identifica a pizza
    pizzaItem.setAttribute('data-key', index);

    // preenche as infos em pizza-item
    pizzaItem.querySelector('.pizza-item--img img').src = pizza.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${pizza.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = pizza.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = pizza.description;

    // Show Modal Event
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');

        sel('.pizzaBig img').src = pizzaJson[key].img;
        sel('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        sel('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;

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
// gera um array com os 2 botoes de cancelar
all('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((botao) => {
    botao.addEventListener('click', closeModal);
})