//* Encapsulate Selectors comands
const sel = el => document.querySelector(el);
const all = el => document.querySelectorAll(el);

const pizzaSizeList = all(".pizza-info--size");

const pizzaModal = document.querySelector(".pizza-modal");

let cart = [];
let modalKey = 0;
let modalQt = 1;
let pizzaPrice = 0;

PizzaList.forEach((pizza, index) => {
  const pizzaItem = setPizzaItemDOM(pizza, index);
  sel(".pizza-area").innerHTML += pizzaItem; // insert pizzaItem
});

function setPizzaItemDOM(pizza, index) {
  const pizzaItem = `
    <div class="pizza-item" data-key=${index}>
      <div class="pizza-item--img"><img src=${pizza.img} /></div>
      <a href="" class="pizza-item--link">
        <div class="pizza-item--add" onclick="openPizzaItemModal(event)">+</div>
      </a>
      <div class="pizza-item--price">R$ ${pizza.prices[2].toFixed(2)}</div>
      <div class="pizza-item--name">${pizza.name} (G)</div>
      <div class="pizza-item--desc">${pizza.description}</div>
    </div>`;

  return pizzaItem;
}

function openPizzaItemModal(event) {
  event.preventDefault();

  setPizzaModalDOM(event);
  openModal();
}

function openModal() {
  pizzaModal.style.opacity = 0;
  pizzaModal.style.display = "flex";
  setTimeout(() => {
    pizzaModal.style.opacity = 1;
  }, 200);
}

function closeModal() {
  pizzaModal.style.opacity = 0;
  setTimeout(() => {
    pizzaModal.style.display = "none";
  }, 500);
}

function setPizzaModalDOM(e) {
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

  setPizzaPrices(pizzaIndex);
}

function setPizzaPrices(pizzaIndex) {

  pizzaSizeList.forEach((size, index) => {
    pizzaPrice = PizzaList[parseInt(pizzaIndex)].prices[index];

    size.addEventListener("click", () => {
      sel(".pizza-info--size.selected").classList.remove("selected");
      size.classList.add("selected");
      pizzaPrice = PizzaList[parseInt(pizzaIndex)].prices[index];
      sel(".pizza-info--actualPrice").innerHTML = `R$ ${(
        pizzaPrice * modalQt
      ).toFixed(2)}`;
    });

    size.querySelector("span").innerHTML = PizzaList[pizzaIndex].sizes[index];
  });
}



// seting the quantity buttons
sel(".pizza-info--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
    sel(".pizza-info--qt").innerHTML = modalQt;

    sel(".pizza-info--actualPrice").innerHTML = `R$ ${(
      pizzaPrice * modalQt
    ).toFixed(2)}`;
  }
});

// max = 50 pizzas
sel(".pizza-info--qtmais").addEventListener("click", () => {
  if (modalQt < 50) {
    modalQt++;
    sel(".pizza-info--qt").innerHTML = modalQt;

    sel(".pizza-info--actualPrice").innerHTML = `R$ ${(
      pizzaPrice * modalQt
    ).toFixed(2)}`;
  }
});

//* Add to Cart
sel(".pizza-info--addButton").addEventListener("click", () => {
  // get selected size
  let size = parseInt(sel(".pizza-info--size.selected").getAttribute("data-key"));

  // id@size = identifier
  let identifier = PizzaList[modalKey].id + "@" + size;

  //* Return -1: if doesn't find an index with the same identifier
  let key = cart.findIndex(item => item.identifier == identifier);

  // Pushing to Cart..
  if (key > -1) {
    cart[key].qt += modalQt; //* updates quantity only if it's already in cart
  } else {
    cart.push({
      identifier,
      id: PizzaList[modalKey].id,
      size,
      qt: modalQt,
    });
  }
  updateCart();
  closeModal();
});

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
