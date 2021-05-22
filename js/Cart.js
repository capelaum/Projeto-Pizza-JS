const Cart = {
  subtotal: 0,
  desconto: 0,
  total: 0,

  cartElement: sel("aside"),
  cartPizzas: sel(".cart"),

  setCartItem(pizzaItem, cartIndex) {
    const pizzaSizeName = Cart.setPizzaSizeName(pizzaItem, cart[cartIndex]);
    const pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

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
    let pizzaSizeName;
    switch (cartItem.size) {
      case 0:
        pizzaSizeName = "P";
        Cart.subtotal += pizzaItem.prices[0] * cartItem.qt;
        break;
      case 1:
        pizzaSizeName = "M";
        Cart.subtotal += pizzaItem.prices[1] * cartItem.qt;
        break;
      case 2:
        pizzaSizeName = "G";
        Cart.subtotal += pizzaItem.prices[2] * cartItem.qt;
        break;
    }
    return pizzaSizeName;
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
      // resets the cart to update
      Cart.cartPizzas.innerHTML = "";
      Cart.subtotal = 0;
      Cart.desconto = 0;
      Cart.total = 0;
      Cart.cartElement.classList.add("show");

      for (let cartIndex in cart) {
        // find the object pizza from cart
        let pizzaItem = PizzaList.find(
          pizza => pizza.id === cart[cartIndex].id
        );

        const cartItem = Cart.setCartItem(pizzaItem, cartIndex);
        Cart.cartPizzas.innerHTML += cartItem;
      }

      Cart.desconto = Cart.subtotal * 0.1;
      Cart.total = Cart.subtotal - Cart.desconto;

      sel(".cart-value-subtotal").innerHTML = `R$ ${Cart.subtotal.toFixed(2)}`;
      sel(".cart-value-desconto").innerHTML = `R$ ${Cart.desconto.toFixed(2)}`;
      sel(".cart-value-total").innerHTML = `R$ ${Cart.total.toFixed(2)}`;
    } else {
      Cart.cartElement.classList.remove("show");
      Cart.cartElement.style.left = "100vw";
    }
  },
};
