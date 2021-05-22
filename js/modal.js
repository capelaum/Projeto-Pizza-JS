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
    sel(".pizza-info--actualPrice").innerHTML = `R$ ${PizzaList[
      pizzaIndex
    ].prices[2].toFixed(2)}`;

    sel(".pizza-info--qt").innerHTML = modalQt;

    Modal.setPizzaPrices(pizzaIndex);
  },

  setPizzaPrices(pizzaIndex) {
    Modal.pizzaSizeList.forEach((size, sizeIndex) => {
      // initial -> pizza G
      if (sizeIndex === 2) Modal.setSelectedSize(size);

      size.addEventListener("click", () => {
        Modal.setSelectedSize(size);

        pizzaPrice = PizzaList[Number(pizzaIndex)].prices[sizeIndex];
        sel(".pizza-info--actualPrice").innerHTML = `R$ ${(
          pizzaPrice * modalQt
        ).toFixed(2)}`;
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

        sel(".pizza-info--actualPrice").innerHTML = `R$ ${(
          pizzaPrice * modalQt
        ).toFixed(2)}`;
      }
    });

    Modal.addPizzaElement.addEventListener("click", () => {
      if (modalQt < 50) {
        // max = 50 pizzas
        modalQt++;
        sel(".pizza-info--qt").innerHTML = modalQt;

        sel(".pizza-info--actualPrice").innerHTML = `R$ ${(
          pizzaPrice * modalQt
        ).toFixed(2)}`;
      }
    });
  },

  //* Add to Cart
  setAddToCartEvent() {
    Modal.addToCartButton.addEventListener("click", () => {
      // get selected size
      const size = parseInt(
        sel(".pizza-info--size.selected").getAttribute("data-key")
      );

      // id@size = identifier
      let identifier = PizzaList[modalKey].id + "@" + size;

      //* Return -1: if doesn't find an index with the same identifier
      let key = cart.findIndex(item => item.identifier == identifier);

      // Pushing to Cart..
      if (key > -1) {
        cart[key].qt += modalQt; //* updates quantity only if it's already in cart
      } else {
        const cartItem = {
          identifier,
          id: PizzaList[modalKey].id,
          size,
          qt: modalQt,
        };

        cart.push(cartItem);
      }
      updateCart();
      Modal.close();
    });
  },
};