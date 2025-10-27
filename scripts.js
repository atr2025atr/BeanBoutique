
// scripts.js - interactivity for Bean Boutique prototype
document.addEventListener('DOMContentLoaded', function(){

  // Show welcome modal for first-time visitors using Bootstrap modal (jQuery required)
  try {
    if(typeof $ !== 'undefined' && $('#welcomeModal').length){
      if(!localStorage.getItem('bean_visited')){
        $('#welcomeModal').modal('show');
      }
      $('#welcomeModal').on('hidden.bs.modal', function () {
        localStorage.setItem('bean_visited','1');
      });
      $('#welcomeSignup').on('submit', function(e){
        e.preventDefault();
        alert('Thank you! Discount code: WELCOME10 — check your email.');
        $('#welcomeModal').modal('hide');
        localStorage.setItem('bean_visited','1');
      });
    }
  } catch(e){ console.warn('Modal init error', e); }

  // Add-to-cart using localStorage
  window.addToCart = function(id, name, price){
    try{
      var cart = JSON.parse(localStorage.getItem('bean_cart') || '[]');
      var found = cart.find(function(i){ return i.id === id; });
      if(found){ found.qty += 1; } else { cart.push({id:id,name:name,price:price,qty:1}); }
      localStorage.setItem('bean_cart', JSON.stringify(cart));
      updateCartCount();
      alert('Added to cart: ' + name);
    }catch(e){ console.error(e); }
  };

  window.updateCartCount = function(){
    try{
      var cart = JSON.parse(localStorage.getItem('bean_cart') || '[]');
      var count = cart.reduce(function(s,i){ return s + (i.qty||0); }, 0);
      var el = document.getElementById('cartCount');
      if(el) el.textContent = count;
    }catch(e){ console.error(e); }
  };
  updateCartCount();

  // Render cart page if cart table present
  if(document.getElementById('cartBody')){
    var tbody = document.getElementById('cartBody');
    var cart = JSON.parse(localStorage.getItem('bean_cart') || '[]');
    if(cart.length === 0){
      tbody.innerHTML = '<tr><td colspan="4">Your cart is empty.</td></tr>';
    } else {
      tbody.innerHTML = '';
      cart.forEach(function(item){
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + item.name + '</td><td>' + item.qty + '</td><td>$' + Number(item.price).toFixed(2) + '</td><td><button class="btn btn-sm btn-outline-secondary" data-id="' + item.id + '">Remove</button></td>';
        tbody.appendChild(tr);
      });
      tbody.querySelectorAll('button[data-id]').forEach(function(btn){
        btn.addEventListener('click', function(){
          var id = this.getAttribute('data-id');
          var cart = JSON.parse(localStorage.getItem('bean_cart') || '[]');
          cart = cart.filter(function(i){ return i.id !== id; });
          localStorage.setItem('bean_cart', JSON.stringify(cart));
          location.reload();
        });
      });
    }
  }

  // Coffee page search filter (animated)
  var coffeeSearch = document.getElementById('coffeeSearch');
  if(coffeeSearch){
    coffeeSearch.addEventListener('input', function(e){
      var q = e.target.value.toLowerCase().trim();
      var cards = document.querySelectorAll('.coffee-card');
      cards.forEach(function(c){
        var keywords = (c.getAttribute('data-keywords') || '').toLowerCase();
        if(q === '' || keywords.indexOf(q) !== -1){
          c.style.display = '';
          if(q !== '') c.classList.add('match'); else c.classList.remove('match');
        } else {
          c.style.display = 'none';
          c.classList.remove('match');
        }
      });
    });
  }

  // initialize swiper if present
  try{
    if(typeof Swiper !== 'undefined' && document.querySelector('.swiper-container')){
      var mySwiper = new Swiper('.swiper-container', {
        loop: true,
        autoplay: { delay: 3000 },
        pagination: { el: '.swiper-pagination', clickable: true }
      });
    }
  }catch(e){ console.warn('Swiper init failed', e); }

  // initialize leaflet map if present
  try{
    if(typeof L !== 'undefined' && document.getElementById('map')){
      var map = L.map('map').setView([16.803282, 96.165745], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      L.marker([16.803282, 96.165745]).addTo(map).bindPopup('Bean Boutique').openPopup();
    }
  }catch(e){ console.warn('Leaflet init failed', e); }

});
