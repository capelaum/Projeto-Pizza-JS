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
      <div class="pizza-item--price">R$ ${pizza.prices[2].toFixed(2)}</div>
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

//* Updates Cart
function updateCart() {
  // Mobile Cart
  sel(".menu-openner span").innerHTML = cart.length;

  if (cart.length > 0) {
    sel("aside").classList.add("show");
    sel(".cart").innerHTML = ""; // resets the cart to update

    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    for (let i in cart) {
      // find the object pizza from cart
      let pizzaItem = PizzaList.find(item => item.id == cart[i].id);
      //subtotal += pizzaItem.prices[i] * cart[i].qt;

      let cartItem = sel(".models .cart--item").cloneNode(true);

      let pizzaSizeName;
      switch (cart[i].size) {
        case 0:
          pizzaSizeName = "P";
          subtotal += pizzaItem.prices[0] * cart[i].qt;
          break;
        case 1:
          pizzaSizeName = "M";
          subtotal += pizzaItem.prices[1] * cart[i].qt;
          break;
        case 2:
          pizzaSizeName = "G";
          subtotal += pizzaItem.prices[2] * cart[i].qt;
          break;
      }

      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
      cartItem.querySelector("img").src = pizzaItem.img;
      cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
      cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt;

      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].qt++;
          updateCart();
        });

      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cart[i].qt > 1) {
            cart[i].qt--;
          } else {
            cart.splice(i, 1);
          }
          updateCart();
        });

      sel(".cart").append(cartItem);
    } // end for in cart[]

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    sel(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
    sel(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`;
    sel(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    sel("aside").classList.remove("show");
    sel("aside").style.left = "100vw";
  }
}
