
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


// tampil tentang kami -----------
const list = document.getElementById("aboutUs");

onValue(ref(db, "tentangKami"), (snapshot) => {
  list.innerHTML = "";

  snapshot.forEach((child) => {
    const data = child.val();

    list.innerHTML += `
      <div class="about-us-div">
        <a href ="${data.image}" target="_blank">
          <img src="${data.image}">
        </a>
        
      </div>
    `;
  });
});

