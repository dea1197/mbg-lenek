

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// pakai config kamu
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

const list = document.getElementById("listGaleri");

onValue(ref(db, "gallery"), (snapshot) => {
  list.innerHTML = "";

  snapshot.forEach((child) => {
    const data = child.val();

    list.innerHTML += `
      <div class="list-galeri-user">
        <a href ="${data.image}" target="_blank">
          <img src="${data.image}">
        </a>
        <p>${data.description}</p>
      </div>
    `;
  });
});

/*
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