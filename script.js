  let cart = JSON.parse(localStorage.getItem('cart')) || {};
  let loggedInUser = null;

function login() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!username || !password) {
    alert("Please enter username and password");
    return;
  }

  const data =
    "Username: " + username +
    "\nPassword: " + password +
    "\n----------------------\n";

  const blob = new Blob([data], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "users.txt";
  link.click();

  loggedInUser = username;
  document.getElementById('loginPage').classList.remove('active');
  document.getElementById('mainNav').classList.add('show');
  showPage('shop');
  document.getElementById('userGreeting').textContent = `Welcome, ${username}!`;
}

  function showPage(pageId) {
    document.querySelectorAll('section.page').forEach(sec => sec.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    if (pageId === 'cart') renderCart();
  }

  function addToCart(name, price) {
    if (!loggedInUser) {
      alert('Please login first to add items to cart.');
      return;
    }
    if (!cart[name]) {
      cart[name] = { price: price, qty: 0 };
    }
    cart[name].qty++;
    saveCartToStorage();
    alert(name + " added to cart!");
  }

  function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    cartItems.innerHTML = '';

    let total = 0;
    if (Object.keys(cart).length === 0) {
      cartItems.innerHTML = '<p>Your cart is empty.</p>';
      cartTotal.textContent = '0';
      document.getElementById('checkoutBtn').disabled = true;
      return;
    }

    for (const item in cart) {
      const { price, qty } = cart[item];
      total += price * qty;

      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <span>${item} (x${qty})</span>
        <span>
          <button onclick="changeQty('${item}', 1)">+</button>
          <button onclick="changeQty('${item}', -1)">-</button>
          <button onclick="removeItem('${item}')">Remove</button>
        </span>
      `;
      cartItems.appendChild(div);
    }

    cartTotal.textContent = total;
    document.getElementById('checkoutBtn').disabled = false;
  }

  function changeQty(item, delta) {
    if (!cart[item]) return;
    cart[item].qty += delta;
    if (cart[item].qty <= 0) {
      delete cart[item];
      alert(item + ' removed from cart');
    } else {
      alert('Updated quantity of ' + item);
    }
    saveCartToStorage();
    renderCart();
  }

  function removeItem(item) {
    if (cart[item]) {
      delete cart[item];
      alert(item + ' removed from cart');
      saveCartToStorage();
      renderCart();
    }
  }

  function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function checkout() {
    if (Object.keys(cart).length === 0) {
      alert('Your cart is empty!');
      return;
    }
    alert('Thank you for your purchase!');
    cart = {};
    saveCartToStorage();
    renderCart();
    showPage('shop');
  }

  function submitFeedback(event) {
  event.preventDefault();

  const name = document.getElementById('fname').value;
  const email = document.getElementById('femail').value;
  const rating = document.getElementById('rating').value;
  const message = document.getElementById('fmsg').value;

  const data =
    "Name: " + name +
    "\nEmail: " + email +
    "\nRating: " + rating +
    "\nFeedback: " + message +
    "\n----------------------\n";

  const blob = new Blob([data], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "feedback.txt";
  link.click();

  document.getElementById('feedbackMsg').style.color = "lightgreen";
  document.getElementById('feedbackMsg').textContent =
    `Thank you for your feedback, ${name}!`;

  document.getElementById('feedbackForm').reset();
}
