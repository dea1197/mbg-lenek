const Informasi = "informasi";

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

// tampilkan List

const listStrOrgAdmin = document.getElementById("listStrOrgiAdmin");

onValue(ref(db, Informasi), (snapshot) => {
  listStrOrgAdmin.innerHTML = "";

  snapshot.forEach((child) => {
    const data = child.val();
    const id = child.key;

    listStrOrgAdmin.innerHTML += `
      <div class="list-strOrg-con" style="border:1px solid #ccc; padding:10px; margin:10px;">

        <a href ="${data.image}" target="_blank">
          <img src="${data.image}" width="100">
        </a>
        
        <p>${data.description}</p>

        <div>
          <button class="editBtn" onclick="editStrOrg('${id}', '${encodeURIComponent(data.description || "")}','${data.image}')">Edit</button>
          <button class="deleteBtn" onclick="hapusStrOrg('${id}')">Delete</button>
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

//----Tambah -----------------

document.getElementById("btnUpload-st-org")
  .addEventListener("click", tambahStrOrg);

async function tambahStrOrg() {
  const file = document.getElementById("image-st-org").files[0];
  const description = document.getElementById("desc-st-org").value;

  if (!isAdminLogin) {
    alert("Harus login sebagai admin!");
    return;
  }

  if (!file) {
    alert("Pilih gambar!");
    return;
  }

  try {
    // upload ke cloudinary
    const imageUrl = await uploadImage(file);

    // simpan ke database
    const newRef = push(ref(db, Informasi));

    await set(newRef, {
      image: imageUrl,
      description
    });

    alert("berhasil ditambahkan!");

  } catch (error) {
    console.log(error);
    alert("Gagal upload..!");
  }
}

//----------------------------------------

window.hapusStrOrg = async function (id) {

  if (!isAdminLogin) {
    alert("Akses ditolak!, Please Login dulu..!");
    return;
  }

  const confirmDelete = confirm("Yakin hapus data ini?");
  if (!confirmDelete) return;

  await remove(ref(db, Informasi + "/" + id));

  alert("Data dihapus!");
};

// Edit Data Struktur Organisasi ------------------

let selectedStrOrgId = null;

const modalStrOrg = document.getElementById("modalStrOrg");
const editStrOrgDesc = document.getElementById("editStrOrgDesc");


// tutup modal
window.closeStrOrgModal = function () {
  modalStrOrg.style.display = "none";
};

const editStrOrgImage = document.getElementById("editStrOrgImage");

document.getElementById("btnUpdateStrOrg")
  .addEventListener("click", async () => {

    const description = editStrOrgDesc.value;
    const file = editStrOrgImage.files[0];

    let imageUrl = oldImageUrl;

    try {
      // kalau user pilih gambar baru
      if (file) {
        imageUrl = await uploadImage(file);
      }

      await update(ref(db, Informasi + "/" + selectedStrOrgId), {
        description,
        image: imageUrl
      });

      alert("Data berhasil diupdate!");
      closeStrOrgModal();

    } catch (error) {
      console.log(error);
      alert("Gagal update!");
    }
  });



let oldImageUrl = "";

window.editStrOrg = function (id, desc, image) {

  if (!isAdminLogin) {
    alert("Akses ditolak!, Please Login dulu..!");
    return;
  }

  selectedStrOrgId = id;

  editStrOrgDesc.value = decodeURIComponent(desc || "");
  oldImageUrl = image;

  modalStrOrg.style.display = "flex";
};

//-----------------------------------
const editStrOrgBtn = document.getElementById("edit-strOrgBtn");
const tambInformasiCon = document.querySelector(".tambInformasi-con");

editStrOrgBtn.addEventListener("click", () => {
  if (tambInformasiCon.style.display === "flex") {
    tambInformasiCon.style.display = "none";
    editStrOrgBtn.textContent = "Edit Struktur Organisasi➕"
  } else {
    tambInformasiCon.style.display = "flex";
    editStrOrgBtn.textContent = "Minimize Form➖"
  }
})

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