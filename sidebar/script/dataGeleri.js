
const GALLERY = "gallery";

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

// tampilkan galeri di admin

const listGaleriAdmin = document.getElementById("listGaleriAdmin");

onValue(ref(db, GALLERY), (snapshot) => {
  listGaleriAdmin.innerHTML = "";

  snapshot.forEach((child) => {
    const data = child.val();
    const id = child.key;

    listGaleriAdmin.innerHTML += `
      <div class="list-galeri-con">
        
        <a href ="${data.image}" target="_blank">
          <img src="${data.image}">
        </a>

        <p>${data.description}</p>

        <div class="card-footer">
          <button class="editBtn" onclick="editGaleri('${id}', '${encodeURIComponent(data.description || "")}','${data.image}')">Edit</button>
          <button class="deleteBtn" onclick="hapusGaleri('${id}')">Delete</button>
        </div>

      </div>
    `;
  });
});

// -------- Auth Login ------------------------

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

//--------------TAmbah Galeri--------------------------------

document.getElementById("btnGaleri")
  .addEventListener("click", tambahGaleri);

async function tambahGaleri() {

  if (!isAdminLogin) {
    alert("Akses ditolak!, Please Login dulu..!");
    return;
  }

  const file = document.getElementById("galeriImage").files[0];
  const description = document.getElementById("galeriDesc").value;

  if (!file) {
    alert("Pilih gambar!");
    return;
  }

  try {
    // upload ke cloudinary
    const imageUrl = await uploadImage(file);

    // simpan ke database
    const newRef = push(ref(db, GALLERY));

    await set(newRef, {
      image: imageUrl,
      description
    });

    alert("Galeri berhasil ditambah!");

  } catch (error) {
    console.log(error);
    alert("Gagal upload galeri!");
  }
}

// -----------button tambah galeri n minimize form ---
const tambahGaleriNmin = document.querySelector(".tmbGaleri-n-min");
const showForm = document.querySelector(".galeri-cont-form");

tambahGaleriNmin.addEventListener("click", () => {
  if (showForm.style.display === "flex") {
    showForm.style.display = "none";
    tambahGaleriNmin.textContent = "Tambah Galeri➕";
  } else {
    showForm.style.display = "flex";
    tambahGaleriNmin.textContent = "Minimize Form➖";
  }

})

// ---------tampil form edit galeri--------

let selectedGaleriId = null;

const modalGaleri = document.getElementById("modalGaleri");
const editGaleriDesc = document.getElementById("editGaleriDesc");


//----------- edit galeri image ----------
const editGaleriImage = document.getElementById("editGaleriImage");

// simpan URL Lama
let oldImageUrl2 = "";

window.editGaleri = function (id, desc, image) {

  if (!isAdminLogin) {
    alert("Akses ditolak!, Please Login dulu..!");
    return;
  }

  selectedGaleriId = id;

  editGaleriDesc.value = decodeURIComponent(desc || "");
  oldImageUrl2 = image;

  modalGaleri.style.display = "block";
};

// ---Hapus Galeri------------
window.hapusGaleri = async function (id) {

  if (!isAdminLogin) {
    alert("Akses ditolak!, Please Login dulu..!");
    return;
  }

  const confirmDelete = confirm("Yakin hapus galeri?");
  if (!confirmDelete) return;

  await remove(ref(db, GALLERY + "/" + id));

  alert("Galeri dihapus!");
};

// ------ update galeri --------------------

document.getElementById("btnUpdateGaleri")
  .addEventListener("click", async () => {

    const description = editGaleriDesc.value;
    const file = editGaleriImage.files[0];

    let imageUrl = oldImageUrl2;

    try {
      // kalau user pilih gambar baru
      if (file) {
        imageUrl = await uploadImage(file);
      }

      await update(ref(db, GALLERY + "/" + selectedGaleriId), {
        description,
        image: imageUrl
      });

      alert("Galeri berhasil diupdate!");
      closeGaleriModal();

    } catch (error) {
      console.log(error);
      alert("Gagal update!");
    }
  });

// tutup modal (batal)
window.closeGaleriModal = function () {
  modalGaleri.style.display = "none";
};

//-----------SIDEBAR -----------

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
