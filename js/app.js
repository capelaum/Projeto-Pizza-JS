const pizzaArea = sel(".pizza-area");

let cart = [];
let modalKey = 0;
let modalQt = 1;
let pizzaPrice = 0;

const setPizzaItemDOM = (pizza, index) => {
  const pizzaItem = `
    <div class="pizza-item" data-key=${index}>
      <div class="pizza-item--img"><img src=${pizza.img} /></div>
      <a href="" class="pizza-item--link">
        <div class="pizza-item--add" onclick="Modal.openPizzaItem(event)">+</div>
      </a>
      <div class="pizza-item--price">R$ ${formatPrice(pizza.prices[2])}</div>
      <div class="pizza-item--name">${pizza.name} (G)</div>
      <div class="pizza-item--desc">${pizza.description}</div>
    </div>`;

  return pizzaItem;
};

PizzaList.forEach((pizza, index) => {
  const pizzaItem = setPizzaItemDOM(pizza, index);
  pizzaArea.innerHTML += pizzaItem;
});

Modal.setQuantityEvents();
Modal.setAddToCartEvent();

/* Cart Menu Mobile */

// Open
sel(".menu-openner").addEventListener("click", () => {
  if (cart.length > 0) {
    sel("aside").style.left = "0";
  }
});

// Close
sel(".menu-closer").addEventListener("click", () => {
  sel("aside").style.left = "100vw";
});

function formatPrice(price) {
  return (price.toFixed(2)).toString().replace(".", ",");
}

