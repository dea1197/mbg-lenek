


const TentangKami = "tentangKami";

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

const aboutUsAdmin = document.getElementById("aboutUs");

onValue(ref(db, TentangKami), (snapshot) => {
  aboutUsAdmin.innerHTML = "";

  snapshot.forEach((child) => {
    const data = child.val();
    const id = child.key;

    aboutUsAdmin.innerHTML += `
      <div class="aboutUs-con">
        
        <a href ="${data.image}" target="_blank">
          <img src="${data.image}">
        </a>

        <p>${data.description}</p>

        <div class="card-footer">
          <button class="editBtn" onclick="editAboutUs('${id}', '${encodeURIComponent(data.description || "")}','${data.image}')">Edit</button>
          
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


// ---------tampil form edit about us--------

let selectedAboutId = null;

const modalAbout = document.getElementById("modalAbout");
const editAboutDesc = document.getElementById("editAboutDesc");


//----------- edit about image ----------
const editAboutImage = document.getElementById("editAboutImage");

// simpan URL Lama
let oldImageUrl3 = "";

window.editAboutUs = function (id, desc, image) {

  if (!isAdminLogin) {
    alert("Akses ditolak!, Please Login dulu..!");
    return;
  }

  selectedAboutId = id;

  editAboutDesc.value = decodeURIComponent(desc || "");
  oldImageUrl3 = image;

  modalAbout.style.display = "block";
};

// tutup modal (batal)
window.closeAboutModal = function () {
  modalAbout.style.display = "none";
};

// ------ update about us --------------------

document.getElementById("btnUpdateAbout")
  .addEventListener("click", async () => {

    const description = editAboutDesc.value;
    const file = editAboutImage.files[0];

    let imageUrl = oldImageUrl3;

    try {
      // kalau user pilih gambar baru
      if (file) {
        imageUrl = await uploadImage(file);
      }

      await update(ref(db, TentangKami + "/" + selectedAboutId), {
        description,
        image: imageUrl
      });

      alert("About berhasil diupdate!");
      closeAboutModal();

    } catch (error) {
      console.log(error);
      alert("Gagal update!");
    }
  });


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