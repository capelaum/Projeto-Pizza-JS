//* Encapsulate Selectors comands
const sel = el => document.querySelector(el);
const all = el => document.querySelectorAll(el);

const Modal = {
  pizzaModal: sel(".pizza-modal"),
  pizzaSizeList: all(".pizza-info--size"),
  addPizzaElement: sel(".pizza-info--qtmais"),
  removePizzaElement: sel(".pizza-info--qtmenos"),
  addToCartButton: sel(".pizza-info--addButton"),

  openPizzaItem(event) {
    event.preventDefault();

    Modal.setPizzaItemDOM(event);
    Modal.open();
  },

  open() {
    Modal.pizzaModal.style.opacity = 0;
    Modal.pizzaModal.style.display = "flex";
    setTimeout(() => {
      Modal.pizzaModal.style.opacity = 1;
    }, 200);
  },

  close() {
    Modal.pizzaModal.style.opacity = 0;
    setTimeout(() => {
      Modal.pizzaModal.style.display = "none";
    }, 500);
  },

  setPizzaItemDOM(e) {
    let pizzaIndex = e.target.closest(".pizza-item").getAttribute("data-key");
    modalKey = pizzaIndex;
    modalQt = 1; // initial pizza qtd

    sel(".pizza-modal-img").src = PizzaList[pizzaIndex].img;
    sel(".pizza-info h1").innerHTML = PizzaList[pizzaIndex].name;
    sel(".pizza-info--desc").innerHTML = PizzaList[pizzaIndex].description;
    sel(".pizza-info--actualPrice").innerHTML = `R$ ${formatPrice(
      PizzaList[pizzaIndex].prices[2]
    )}`;

    sel(".pizza-info--qt").innerHTML = modalQt;

    Modal.setPizzaPrices(pizzaIndex);
  },

  setPizzaPrices(pizzaIndex) {
    Modal.pizzaSizeList.forEach((size, sizeIndex) => {
      // initial -> pizza G
      if (sizeIndex === 2) Modal.setSelectedSize(size);
      pizzaPrice = PizzaList[Number(pizzaIndex)].prices[sizeIndex];

      size.addEventListener("click", () => {
        Modal.setSelectedSize(size);

        pizzaPrice = PizzaList[Number(pizzaIndex)].prices[sizeIndex];
        sel(".pizza-info--actualPrice").innerHTML = `R$ ${formatPrice(
          pizzaPrice * modalQt
        )}`;
      });

      size.querySelector("span").innerHTML =
        PizzaList[pizzaIndex].sizes[sizeIndex];
    });
  },

  setSelectedSize(size) {
    sel(".pizza-info--size.selected").classList.remove("selected");
    size.classList.add("selected");
  },

  setQuantityEvents() {
    // seting the quantity buttons
    Modal.removePizzaElement.addEventListener("click", () => {
      if (modalQt > 1) {
        modalQt--;
        sel(".pizza-info--qt").innerHTML = modalQt;

        sel(".pizza-info--actualPrice").innerHTML = `R$ ${formatPrice(
          pizzaPrice * modalQt
        )}`;
      }
    });

    Modal.addPizzaElement.addEventListener("click", () => {
      if (modalQt < 50) {
        // max = 50 pizzas
        modalQt++;
        sel(".pizza-info--qt").innerHTML = modalQt;

        sel(".pizza-info--actualPrice").innerHTML = `R$ ${formatPrice(
          pizzaPrice * modalQt
        )}`;
      }
    });
  },

  //* Add to Cart
  setAddToCartEvent() {
    Modal.addToCartButton.addEventListener("click", () => {
      // get selected size
      const sizeIndex = parseInt(
        sel(".pizza-info--size.selected").getAttribute("data-key")
      );

      // id@size = identifier
      const identifier = PizzaList[modalKey].id + "@" + sizeIndex;
      const key = cart.findIndex(item => item.identifier == identifier);

      //* if it is already in cart
      if (key > -1) cart[key].qt += modalQt;

      //* if it is already in cart
      if (key === -1) {
        const cartItem = {
          identifier,
          id: PizzaList[modalKey].id,
          sizeIndex,
          qt: modalQt,
        };

        cart.push(cartItem);
      }

      Cart.update();
      Modal.close();
    });
  },
};
