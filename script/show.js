const COLLECTION = "menuMbg";

const PorsiBesar = "porsiBesar";

const SliderImg = "sliderImg";

const GambarKiri = "gambarKiri";

const GambarKanan = "gambarKanan";



import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getDatabase,
  ref,
  onValue
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDpCIKhrnhCOwFija0d8-ygHvqVsptCL1A",
  authDomain: "my-web-admin-49c0b.firebaseapp.com",
  databaseURL: "https://my-web-admin-49c0b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "my-web-admin-49c0b",
  storageBucket: "my-web-admin-49c0b.appspot.com",
  messagingSenderId: "115428783382",
  appId: "1:115428783382:web:dd231900bcdd1d9b660c37",
  measurementId: "G-K0ND8KF6L0"
};


const app = initializeApp(firebaseConfig);

const db = getDatabase();
const listUser = document.getElementById("listUser");

onValue(ref(db, COLLECTION), (snapshot) => {
  listUser.innerHTML = "";

  snapshot.forEach((child) => {
    const data = child.val();

    listUser.innerHTML += `
     
     <div class="menu-item" onclick="loadDetail('${child.key}')" style="cursor:pointer;">
        <img src="${data.image}" alt="${data.name}">
        <div class="menu-item-label">${data.name}</div>
     </div>
`;
  });
});

window.loadDetail = function (id) {
  window.location.href = `detail.html?id=${id}`;
};

// -----------List Porsi Besar--------
const listPorsiBesar = document.getElementById("listPorsiBesar");

onValue(ref(db, PorsiBesar), (snapshot) => {
  listPorsiBesar.innerHTML = "";

  snapshot.forEach((child) => {
    const data = child.val();

    listPorsiBesar.innerHTML += `
     
     <div class="menu-item" onclick="loadDetail('${child.key}')" style="cursor:pointer;">
        <img src="${data.image}" alt="${data.name}">
        <div class="menu-item-label">${data.name}</div>
     </div>
     
`;
  });
});

// --------------list Slider img ------

const listSlider = document.getElementById("listSlider");

onValue(ref(db, SliderImg), (snapshot) => {
  listSlider.innerHTML = "";

  snapshot.forEach((child) => {
    const data = child.val();
    listSlider.innerHTML += `
      <div class="slide">
        <img src="${data.image}" alt="slider">
      </div>
    `;
  });

  // Panggil DISINI, setelah semua gambar sudah ada di DOM
  initializeSlide();
});

// ---- Gambar Kiri ----------------

const gambarKiriImg = document.getElementById("gambar-kiri");

onValue(ref(db, GambarKiri), (snapshot) => {
  gambarKiriImg.innerHTML = "";

  snapshot.forEach((child) => {
    const data = child.val();

    gambarKiriImg.innerHTML += `

     <img src="${data.image}" alt="Gambar Kiri">
     
`;
  });
});

// ---- Gambar Kanan ----------------

const gambarKananImg = document.getElementById("gambar-kanan");

onValue(ref(db, GambarKanan), (snapshot) => {
  gambarKananImg.innerHTML = "";

  snapshot.forEach((child) => {
    const data = child.val();

    gambarKananImg.innerHTML += `

     <img src="${data.image}" alt="Gambar Kanan">
     
`;
  });
});



