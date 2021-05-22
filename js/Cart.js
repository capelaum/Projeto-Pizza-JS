const Cart = {
  cartElement: sel("aside"),
  cartPizzas: sel(".cart"),
  subtotalElement: sel(".cart-value-subtotal"),
  descontoElement: sel(".cart-value-desconto"),
  totalElement: sel(".cart-value-total"),
  subtotal: 0,
  desconto: 0,
  total: 0,

  setPizzaItemDOM(pizzaItem, cartIndex) {
    const pizzaInfo = Cart.setPizzaSizeName(pizzaItem, cart[cartIndex]);
    const pizzaName = `${pizzaItem.name} ${pizzaInfo}`;

    const cartItem = `
    <div class="cart--item">
      <img src=${pizzaItem.img} />
      <div class="cart--item-nome">${pizzaName}</div>
      <div class="cart--item--qtarea">
        <button class="cart--item-qtmenos" onclick="Cart.removeCartItem(${cartIndex})">-</button>
        <div class="cart--item--qt">${cart[cartIndex].qt}</div>
        <button class="cart--item-qtmais" onclick="Cart.addCartItem(${cartIndex})">+</button>
      </div>
    </div>`;

    return cartItem;
  },

  setPizzaSizeName(pizzaItem, cartItem) {
    let pizzaInfo;
    let pizzaPrice;

    switch (cartItem.sizeIndex) {
      case 0:
        pizzaPrice = pizzaItem.prices[0];
        pizzaInfo = `(P)<br>R$ ${formatPrice(pizzaPrice)}`;
        break;
      case 1:
        pizzaPrice = pizzaItem.prices[1];
        pizzaInfo = `(M)<br>R$ ${formatPrice(pizzaPrice)}`;
        break;
      case 2:
        pizzaPrice = pizzaItem.prices[2];
        pizzaInfo = `(G)<br>R$ ${formatPrice(pizzaPrice)}`;
        break;
    }

    Cart.subtotal += pizzaPrice * cartItem.qt;
    return pizzaInfo;
  },

  addCartItem(cartIndex) {
    cart[cartIndex].qt++;
    Cart.update();
  },

  removeCartItem(cartIndex) {
    if (cart[cartIndex].qt > 1) {
      cart[cartIndex].qt--;
    } else {
      cart.splice(cartIndex, 1);
    }

    Cart.update();
  },

  update() {
    // Mobile Cart
    sel(".menu-openner span").innerHTML = cart.length;

    if (cart.length > 0) {
      // reset cart to update
      Cart.reset();
      Cart.cartElement.classList.add("show");

      cart.forEach((cartItem, cartIndex) => {
        // find the object pizza from cart
        let pizzaItem = PizzaList.find(pizza => pizza.id === cartItem.id);

        const pizzaItemElement = Cart.setPizzaItemDOM(pizzaItem, cartIndex);
        Cart.cartPizzas.innerHTML += pizzaItemElement;
      });

      Cart.setValues();
    } else {
      Cart.cartElement.classList.remove("show");
      Cart.cartElement.style.left = "100vw";
    }
  },

  reset() {
    Cart.cartPizzas.innerHTML = "";
    Cart.subtotal = 0;
    Cart.desconto = 0;
    Cart.total = 0;
  },

  setValues() {
    Cart.desconto = Cart.subtotal * 0.1;
    Cart.total = Cart.subtotal - Cart.desconto;

    Cart.subtotalElement.innerHTML = `R$ ${formatPrice(Cart.subtotal)}`;
    Cart.descontoElement.innerHTML = `R$ ${formatPrice(Cart.desconto)}`;
    Cart.totalElement.innerHTML = `R$ ${formatPrice(Cart.total)}`;
  },

  setMenuMobileEvents() {
    sel(".menu-openner").addEventListener("click", () => {
      if (cart.length > 0) {
        sel("aside").style.left = "0";
      }
    });

    sel(".menu-closer").addEventListener("click", () => {
      sel("aside").style.left = "100vw";
    });
  },
};
