import { initializeApp }
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getDatabase,
  ref,
  get
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDpCIKhrnhCOwFija0d8-ygHvqVsptCL1A",
  authDomain: "my-web-admin-49c0b.firebaseapp.com",
  databaseURL: "https://my-web-admin-49c0b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "my-web-admin-49c0b",
  storageBucket: "my-web-admin-49c0b.appspot.com",
  messagingSenderId: "115428783382",
  appId: "1:115428783382:web:dd231900bcdd1d9b660c37"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadDetail() {

  let snapshot = await get(ref(db, "menuMbg/" + id));
  document.querySelector(".h3-porsi").textContent = "Porsi Kecil";
  if (!snapshot.exists()) {

    // cek porsi besar
    snapshot = await get(ref(db, "porsiBesar/" + id));
    document.querySelector(".h3-porsi").textContent = "Porsi Besar";
    // kalau tetap tidak ada
    if (!snapshot.exists()) {
      document.getElementById("detail-panel").innerHTML =
        "<h2>Data tidak ditemukan</h2>";
      return;
    }
  }

  const data = snapshot.val();

  const detail = data.detail;

  const giziHTML = `
    <div class="nutri-box">
      <span class="n-label">Energi</span>
      <span class="n-val">${detail.gizi.energi}</span>
    </div>

    <div class="nutri-box">
      <span class="n-label">Protein</span>
      <span class="n-val">${detail.gizi.protein}</span>
    </div>

    <div class="nutri-box">
      <span class="n-label">Serat</span>
      <span class="n-val">${detail.gizi.serat}</span>
    </div>

    <div class="nutri-box">
      <span class="n-label">Karbohidrat</span>
      <span class="n-val">${detail.gizi.karbohidrat}</span>
    </div>

    <div class="nutri-box">
      <span class="n-label">Lemak</span>
      <span class="n-val">${detail.gizi.lemak}</span>
    </div>

    <div class="nutri-box">
      <span class="n-label">Natrium</span>
      <span class="n-val">${detail.gizi.natrium}</span>
    </div>
  `;

  const bahanHTML = detail.bahanUtama
    .map(item => `<span class="ingr-tag">${item}</span>`)
    .join("");

  const kaloriMax = 600;

  const pct = Math.min(
    Math.round((detail.kalori / kaloriMax) * 100),
    100
  );

  document.getElementById("detail-panel").innerHTML = `
  
    <div class="detail-hero">
      <img src="${data.image}" 
           style="width:100%; height:100%; object-fit:cover;">
    </div>

    <div class="detail-body">

      <h2>${data.name}</h2>

      <p class="detail-sub">${detail.porsi}</p>

      <p class="detail-desc">${detail.desc}</p>

      <div class="cal-bar-wrap">

  <div class="cal-bar-label">
    <span>Kalori</span>

    <span>
      <strong>${detail.kalori} kkal</strong>
      dari kebutuhan harian ±600 kkal/porsi MBG
    </span>
  </div>

  <div class="cal-bar-track">
    <div 
      class="cal-bar-fill"
      style="width:${pct}%;">
    </div>
  </div>

</div>

      <p class="nutri-title">Informasi Nilai Gizi</p>

      <div class="nutri-grid">
        ${giziHTML}
      </div>

      <p class="ingr-title">Bahan Utama</p>

      <div class="ingr-list">
        ${bahanHTML}
      </div>

      <div class="allergen-row">
        <span>
          <strong>Alergen:</strong>
          ${detail.alergen}
        </span>
      </div>

    </div>
  `;
}

loadDetail();






/*
const COLLECTION = "menuMbg";

const PorsiBesar = "porsiBesar";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { 
  getDatabase, 
  ref, 
  get 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// config kamu
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
const db = getDatabase(app);

// ambil ID dari URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const detail = document.getElementById("detail");

// ambil data dari database
async function loadDetail() {
  // Cek porsi kecil dulu
  const snapshotKecil = await get(ref(db, COLLECTION + "/" + id));

  if (snapshotKecil.exists()) {
    const data = snapshotKecil.val();
    detail.innerHTML = `
      <h3 class="detPorsiKecil">Porsi Kecil</h3>
      <div class="detail-container">
        <a href="${data.image}" target="_blank">
          <img src="${data.image}">
        </a>
        <h2>${data.name}</h2>
        <p>${data.description || "Tidak ada deskripsi"}</p>
      </div>
    `;
    return; // stop, sudah ketemu
  }

  // Kalau tidak ada di porsi kecil, cek porsi besar
  const snapshotBesar = await get(ref(db, PorsiBesar + "/" + id));

  if (snapshotBesar.exists()) {
    const data = snapshotBesar.val();
    detail.innerHTML = `
      <h3 class="detPorsiBesar">Porsi Besar</h3>
      <div class="detail-container">
        <a href="${data.image}" target="_blank">
          <img src="${data.image}">
        </a>
        <h2>${data.name}</h2>
        <p>${data.description || "Tidak ada deskripsi"}</p>
      </div>
    `;
    return;
  }

  // Kalau keduanya tidak ada
  detail.innerHTML = "<p class='not-found'>Data tidak ditemukan</p>";
}

loadDetail(); // panggil sekali saja

// --- background animasi bergerak ---

document.addEventListener('DOMContentLoaded', function () {
  const icons = ['🍚','🥦','🥕','🍳','🥗','🌽','🍅','🥩','🍱'];

  for (let i = 0; i < 18; i++) {
    const ic = document.createElement('span');
    ic.textContent = icons[Math.floor(Math.random() * icons.length)];

    // Semua style langsung di inline, tidak pakai CSS class sama sekali
    ic.style.cssText = `
      position: fixed;
      left: ${Math.random() * 90}%;
      bottom: ${Math.random() * 100}%;
      font-size: ${20 + Math.random() * 20}px;
      pointer-events: none;
      z-index: 2;
      animation: driftUp ${4 + Math.random() * 5}s linear ${-(Math.random() * 9)}s infinite;
    `;

    document.body.appendChild(ic);
  }

  // Inject keyframe langsung ke head
  const style = document.createElement('style');
  style.textContent = `
    @keyframes driftUp {
      0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
      10%  { opacity: 0.6; }
      90%  { opacity: 0.6; }
      100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
});

*/