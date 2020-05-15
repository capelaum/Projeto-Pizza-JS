//* Eetorna o comando para constante!
const sel = (el) => document.querySelector(el);
const all = (el) => document.querySelectorAll(el);

// mapeia as pizzas e realiza uma operation
pizzaJson.map((pizza, index) => {
    // clona o elemento e seu conteudo
    let pizzaItem = sel('.models .pizza-item').cloneNode(true);
    // preenche as infos em pizza-item

    sel('.pizza-area').append(pizzaItem);
})