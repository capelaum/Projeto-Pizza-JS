//* Encapsulate Selectors comands
const sel = el => document.querySelector(el);
const all = el => document.querySelectorAll(el);

const pizzaWindowArea = document.querySelector(".pizzaWindowArea");

let cart = [];
let modalKey = 0;
let modalQt = 1;
let pizzaPrice = 0;

pizzaJson.map((pizza, index) => {
  // clones pizza item and content
  let pizzaItem = sel(".models .pizza-item").cloneNode(true);

  //* Generate an attribute data-key to the pizza-item
  pizzaItem.setAttribute("data-key", index);

  // Pizza item info
  pizzaItem.querySelector(".pizza-item--img img").src = pizza.img;
  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerHTML = `R$ ${pizza.prices[2].toFixed(2)}`;
  pizzaItem.querySelector(".pizza-item--name").innerHTML = pizza.name + " (G)";
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = pizza.description;

  // Show Modal Event
  const pizzaItemButton = pizzaItem.querySelector("a");
  pizzaItemButton.addEventListener("click", openPizzaItemModal); // end modal

  sel(".pizza-area").append(pizzaItem); // insert pizzaItem
});

function openPizzaItemModal(event) {
  event.preventDefault();

  //* Get the pizza key
  let key = event.target.closest(".pizza-item").getAttribute("data-key");
  modalKey = key;
  modalQt = 1; // initial pizza qtd

  sel(".pizzaBig img").src = pizzaJson[key].img;
  sel(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
  sel(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
  sel(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[
    key
  ].prices[2].toFixed(2)}`;

  // remove selected size item
  sel(".pizzaInfo--size.selected").classList.remove("selected");

  //! preço por tamanho
  all(".pizzaInfo--size").forEach((size, index) => {
    pizzaPrice = pizzaJson[parseInt(key)].prices[index];

    size.addEventListener("click", () => {
      sel(".pizzaInfo--size.selected").classList.remove("selected");
      size.classList.add("selected");
      pizzaPrice = pizzaJson[parseInt(key)].prices[index];
      sel(".pizzaInfo--actualPrice").innerHTML = `R$ ${(
        pizzaPrice * modalQt
      ).toFixed(2)}`;
    });

    //* big size selected!
    if (index === 2) size.classList.add("selected");

    size.querySelector("span").innerHTML = pizzaJson[key].sizes[index];
  });

  sel(".pizzaInfo--qt").innerHTML = modalQt;
  pizzaWindowArea.style.opacity = 0;
  pizzaWindowArea.style.display = "flex";

  // faz efeito suave
  setTimeout(() => {
    pizzaWindowArea.style.opacity = 1;
  }, 200);
}

function closeModal() {
  pizzaWindowArea.style.opacity = 0;
  setTimeout(() => {
    pizzaWindowArea.style.display = "none";
  }, 500);
}

// Array of 2 Cancel Buttons
all(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(btn => {
  btn.addEventListener("click", closeModal);
});

// seting the qt buttons
sel(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
    sel(".pizzaInfo--qt").innerHTML = modalQt;

    sel(".pizzaInfo--actualPrice").innerHTML = `R$ ${(
      pizzaPrice * modalQt
    ).toFixed(2)}`;
  }
});

// max = 50 pizzas
sel(".pizzaInfo--qtmais").addEventListener("click", () => {
  if (modalQt < 50) {
    modalQt++;
    sel(".pizzaInfo--qt").innerHTML = modalQt;

    sel(".pizzaInfo--actualPrice").innerHTML = `R$ ${(
      pizzaPrice * modalQt
    ).toFixed(2)}`;
  }
});

// select size
all(".pizzaInfo--size").forEach((size, index) => {
  size.addEventListener("click", e => {
    // reset
    sel(".pizzaInfo--size.selected").classList.remove("selected");

    // add
    size.classList.add("selected");
  });
});

//* Add to Cart
sel(".pizzaInfo--addButton").addEventListener("click", () => {
  // get selected size
  let size = parseInt(
    sel(".pizzaInfo--size.selected").getAttribute("data-key")
  );

  // id@size = identifier
  let identifier = pizzaJson[modalKey].id + "@" + size;

  //* Return -1: if doesn't find an index with the same identifier
  let key = cart.findIndex(item => item.identifier == identifier);

  // Pushing to Cart..
  if (key > -1) {
    cart[key].qt += modalQt; //* updates quantity only if it's already in cart
  } else {
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
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
      let pizzaItem = pizzaJson.find(item => item.id == cart[i].id);
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
