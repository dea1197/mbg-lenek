const SliderImg = "sliderImg";

const GambarKiri = "gambarKiri";

const GambarKanan = "gambarKanan";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { onAuthStateChanged, signOut }
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getDatabase,
  ref,
  push,
  set
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


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
const auth = getAuth(app);

import {
  onValue,
  remove,
  update
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";


//----------- tampil list slider di admin----
const listSliderAdmin = document.getElementById("list-slider");

onValue(ref(db, SliderImg), (snapshot) => {
  listSliderAdmin.innerHTML = "";

  snapshot.forEach((child) => {
    const data = child.val();
    const id = child.key;

    listSliderAdmin.innerHTML += `
      <div class="list-slider-con">
        
        <a href ="${data.image}" target="_blank">
          <img src="${data.image}">
        </a>

        <div class="card-footer">
          
          <button class="deleteBtn" onclick="hapusSlider('${id}')">Delete</button>
        </div>

      </div>
    `;
  });
});

//------ auth login ------------
let isAdminLogin = false;

onAuthStateChanged(auth, (user) => {
  if (user) {
    isAdminLogin = true;
    console.log("Admin login:", user.email);
  } else {
    isAdminLogin = false;
    console.log("Belum login");
  }
});

// ----- Upload Image dari database cloudinary-------

async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "images_upl");


  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dza21acvq/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url;
}

//------- tambah list slider img ----

document.getElementById("btnSlider")
  .addEventListener("click", tambahSlider);

async function tambahSlider() {

  if (!isAdminLogin) {
    alert("Akses ditolak!, Please Login dulu..!");
    return;
  }

  const file = document.getElementById("sliderImage").files[0];
  

  if (!file) {
    alert("Pilih gambar!");
    return;
  }

  try {
    // upload ke cloudinary
    const imageUrl = await uploadImage(file);

    // simpan ke database
    const newRef = push(ref(db, SliderImg));

    await set(newRef, {
      image: imageUrl
    });

    alert("Galeri berhasil ditambah!");

  } catch (error) {
    console.log(error);
    alert("Gagal upload galeri!");
  }
}

// ---Hapus Slider------------
window.hapusSlider = async function (id) {

  if (!isAdminLogin) {
    alert("Akses ditolak!, Please Login dulu..!");
    return;
  }

  const confirmDelete = confirm("Yakin hapus galeri?");
  if (!confirmDelete) return;

  await remove(ref(db, SliderImg + "/" + id));

  alert("Galeri dihapus!");
};

const showTmbSlider = document.querySelector(".galeri-cont-form");
const btnTmbSlider = document.getElementById("btnTmb-slider");

btnTmbSlider.addEventListener("click", () => {
  if(showTmbSlider.style.display === "none"){
    showTmbSlider.style.display = "flex";
    btnTmbSlider.textContent = "Minimize➖"
  }else{
    showTmbSlider.style.display = "none";
    btnTmbSlider.textContent = "Tambah Gambar Slider➕"
  }
})

// ------ Tambah Gambar Kiri -----

document.getElementById("btnGambarKiri")
  .addEventListener("click", tambahGambarKiri);

async function tambahGambarKiri() {

  if (!isAdminLogin) {
    alert("Akses ditolak!, Please Login dulu..!");
    return;
  }

  const file = document.getElementById("kiriImage").files[0];
  

  if (!file) {
    alert("Pilih gambar!");
    return;
  }

  try {
    // upload ke cloudinary
    const imageUrl = await uploadImage(file);

    // simpan ke database
    const newRef = push(ref(db, GambarKiri));

    await set(newRef, {
      image: imageUrl
    });

    alert("Galeri berhasil ditambah!");

  } catch (error) {
    console.log(error);
    alert("Gagal upload galeri!");
  }
}

//----------- tampil Gambar Kiri di admin----
const listGambarKiriAdmin = document.getElementById("gambar-kiri");

onValue(ref(db, GambarKiri), (snapshot) => {
  listGambarKiriAdmin.innerHTML = "";

  snapshot.forEach((child) => {
    const data = child.val();
    const id = child.key;

    listGambarKiriAdmin.innerHTML += `
      <div class="list-gmbKiri-con">
        
        <a href ="${data.image}" target="_blank">
          <img src="${data.image}">
        </a>

        <div class="card-footer">
          
          <button class="deleteBtn" onclick="hapusGambarKiri('${id}')">Delete</button>
        </div>

      </div>
    `;
  });
});

// ---Hapus Gambar Kiri------------
window.hapusGambarKiri = async function (id) {

  if (!isAdminLogin) {
    alert("Akses ditolak!, Please Login dulu..!");
    return;
  }

  const confirmDelete = confirm("Yakin hapus galeri?");
  if (!confirmDelete) return;

  await remove(ref(db, GambarKiri + "/" + id));

  alert("Galeri dihapus!");
};

const showTmbGmbKiri = document.querySelector(".galeri-cont-form-2");
const btnTmbGmbKiri = document.getElementById("btnTmb-gmbKiri");

btnTmbGmbKiri.addEventListener("click", () => {
  if(showTmbGmbKiri.style.display === "none"){
    showTmbGmbKiri.style.display = "flex";
    btnTmbGmbKiri.textContent = "Minimize➖"
  }else{
    showTmbGmbKiri.style.display = "none";
    btnTmbGmbKiri.textContent = "Tambah Gambar Kiri➕"
  }
})

// ------ Tambah Gambar Kanan -----

document.getElementById("btnGambarKanan")
  .addEventListener("click", tambahGambarKanan);

async function tambahGambarKanan() {

  if (!isAdminLogin) {
    alert("Akses ditolak!, Please Login dulu..!");
    return;
  }

  const file = document.getElementById("kananImage").files[0];
  

  if (!file) {
    alert("Pilih gambar!");
    return;
  }

  try {
    // upload ke cloudinary
    const imageUrl = await uploadImage(file);

    // simpan ke database
    const newRef = push(ref(db, GambarKanan));

    await set(newRef, {
      image: imageUrl
    });

    alert("Galeri berhasil ditambah!");

  } catch (error) {
    console.log(error);
    alert("Gagal upload galeri!");
  }
}

//----------- tampil Gambar Kiri di admin----
const listGambarKananAdmin = document.getElementById("gambar-kanan");

onValue(ref(db, GambarKanan), (snapshot) => {
  listGambarKananAdmin.innerHTML = "";

  snapshot.forEach((child) => {
    const data = child.val();
    const id = child.key;

    listGambarKananAdmin.innerHTML += `
      <div class="list-gmbKanan-con">
        
        <a href ="${data.image}" target="_blank">
          <img src="${data.image}">
        </a>

        <div class="card-footer">
          
          <button class="deleteBtn" onclick="hapusGambarKanan('${id}')">Delete</button>
        </div>

      </div>
    `;
  });
});

// ---Hapus Gambar Kiri------------
window.hapusGambarKanan = async function (id) {

  if (!isAdminLogin) {
    alert("Akses ditolak!, Please Login dulu..!");
    return;
  }

  const confirmDelete = confirm("Yakin hapus galeri?");
  if (!confirmDelete) return;

  await remove(ref(db, GambarKanan + "/" + id));

  alert("Galeri dihapus!");
};

// ---sideBar -----

const sidebar = document.querySelector(".sidebar");
const btnSidebar = document.getElementById("btn-sidebar");

btnSidebar.addEventListener("click", () => {

  sidebar.classList.toggle("active");
  const btnToggle = btnSidebar.classList.toggle("active")
  if (btnToggle) {
    btnSidebar.textContent = `❮`;
  } else {
    btnSidebar.textContent = `❯`
  }
})