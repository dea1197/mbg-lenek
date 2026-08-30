const COLLECTION = "menuMbg";

const PorsiBesar = "porsiBesar";


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { onAuthStateChanged, signOut }
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getDatabase,
  ref,
  push,
  set,
  get
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


import {
  onValue,
  remove,
  update
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

const db = getDatabase(app);
const auth = getAuth(app);


// 🔐 LOGIN
document.getElementById("loginBtn")
  .addEventListener("click", login);

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login berhasil!");
  } catch (error) {
    alert("Login gagal!");

  }
}

// ➕ TAMBAH PRODUK + UPLOAD GAMBAR
document.getElementById("btnTambah")
  .addEventListener("click", tambahProduk);

document.getElementById("btnTambah-2")
  .addEventListener("click", tambahProduk2);

async function tambahProduk() {
  if (!auth.currentUser) {
    alert("Login dulu!");
    return;
  }

  // DATA MENU UTAMA
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const file = document.getElementById("image").files[0];

  // DETAIL MENU

  const porsi = document.getElementById("porsi").value;
  const descDetail = document.getElementById("descDetail").value;
  const kalori = document.getElementById("kalori").value;

  const energi = document.getElementById("energi").value;
  const protein = document.getElementById("protein").value;
  const serat = document.getElementById("serat").value;
  const karbohidrat = document.getElementById("karbohidrat").value;
  const lemak = document.getElementById("lemak").value;
  const natrium = document.getElementById("natrium").value;

  const bahanUtama = document.getElementById("bahanUtama").value;
  const alergen = document.getElementById("alergen").value;

  if (!file) {
    alert("Pilih gambar!");
    return;
  }

  try {

    // upload gambar utama
    const imageUrl = await uploadImage(file);

    // buat id baru
    const newRef = push(ref(db, COLLECTION));

    await set(newRef, {
      name,
      price,
      image: imageUrl,

      detail: {
        porsi: porsi,
        desc: descDetail,
        kalori,

        gizi: {
          energi,
          protein,
          serat,
          karbohidrat,
          lemak,
          natrium
        },

        bahanUtama: bahanUtama.split(","),

        alergen
      }
    });

    alert("Berhasil ditambah!");

  } catch (error) {
    console.log(error);
    alert("Gagal tambah produk!");
  }
}

// -----tambah porsi besar -------------------
async function tambahProduk2() {
  if (!auth.currentUser) {
    alert("Login dulu!");
    return;
  }

  // DATA MENU UTAMA
  const name = document.getElementById("name2").value;
  const price = document.getElementById("price2").value;
  const file = document.getElementById("image2").files[0];

  // DETAIL MENU

  const porsi = document.getElementById("porsi2").value;
  const descDetail = document.getElementById("descDetail2").value;
  const kalori = document.getElementById("kalori2").value;

  const energi = document.getElementById("energi2").value;
  const protein = document.getElementById("protein2").value;
  const serat = document.getElementById("serat2").value;
  const karbohidrat = document.getElementById("karbohidrat2").value;
  const lemak = document.getElementById("lemak2").value;
  const natrium = document.getElementById("natrium2").value;

  const bahanUtama = document.getElementById("bahanUtama2").value;
  const alergen = document.getElementById("alergen2").value;

  if (!file) {
    alert("Pilih gambar!");
    return;
  }

  try {

    // upload gambar utama
    const imageUrl = await uploadImage(file);

    // buat id baru
    const newRef = push(ref(db, PorsiBesar));

    await set(newRef, {
      name,
      price,
      image: imageUrl,

      detail: {
        porsi: porsi,
        desc: descDetail,
        kalori,

        gizi: {
          energi,
          protein,
          serat,
          karbohidrat,
          lemak,
          natrium
        },

        bahanUtama: bahanUtama.split(","),

        alergen
      }
    });

    alert("Berhasil ditambah!");

  } catch (error) {
    console.log(error);
    alert("Gagal tambah produk!");
  }
}

//--------------------------------


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

onAuthStateChanged(auth, (user) => {
  const loginForm = document.getElementById("loginForm");
  const welcome = document.getElementById("welcome");
  const logoutBtn = document.getElementById("logoutBtn");

  if (user) {
    // ✅ jika sudah login
    loginForm.style.display = "none";

    welcome.style.display = "block";
    logoutBtn.style.display = "block";

    welcome.innerText = "Welcome, " + user.email;

  } else {
    // ❌ jika belum login
    loginForm.style.display = "flex";

    welcome.style.display = "none";
    logoutBtn.style.display = "none";
  }
});

document.getElementById("logoutBtn")
  .addEventListener("click", async () => {
    await signOut(auth);
    alert("Logout berhasil!");
  });


//------------------------------------------------------

const listAdmin = document.getElementById("listAdmin");


onValue(ref(db, COLLECTION), (snapshot) => {
  listAdmin.innerHTML = "";

  snapshot.forEach((child) => {
    const data = child.val();
    const id = child.key;

    listAdmin.innerHTML += `
      <div class="menu-item">

        <a href ="${data.image}" target="_blank">
          <img src="${data.image}" alt="${data.name}">
        </a>
        
        <div class="menu-item-label">${data.name}</div>
        <p>Rp.${data.price}</p>
        
        <div class="btn-editDel-con">
          <button class="editBtn" onclick="editProduk('${id}')">Edit</button>
          <button class="deleteBtn" onclick="hapusProduk('${id}')">Delete</button>
        </div>
        
      </div>

     
    `;
  });
});

// ---- list porsi besar admin------------
const listPorsiBesar = document.getElementById("listPorsiBesar");

onValue(ref(db, PorsiBesar), (snapshot) => {
  listPorsiBesar.innerHTML = "";

  snapshot.forEach((child) => {
    const data = child.val();
    const id = child.key;

    listPorsiBesar.innerHTML += `
      <div class="menu-item">

        <a href ="${data.image}" target="_blank">
          <img src="${data.image}" alt="${data.name}">
        </a>
        
        <div class="menu-item-label">${data.name}</div>
        <p>Rp.${data.price}</p>
        
        <div class="btn-editDel-con">
          <button class="editBtn" onclick="editProduk2('${id}')">Edit</button>
          <button class="deleteBtn" onclick="hapusProduk2('${id}')">Delete</button>
        </div>
        
      </div>

     
    `;
  });
});
//------------------------------------

window.hapusProduk = async function (id) {

  if (!isAdminLogin) {
    alert("Akses ditolak!, Please Login dulu..!");
    return;
  }

  const confirmDelete = confirm("Yakin hapus?");
  if (!confirmDelete) return;

  await remove(ref(db, COLLECTION + "/" + id));
  alert("Berhasil dihapus");
};

window.hapusProduk2 = async function (id) {

  if (!isAdminLogin) {
    alert("Akses ditolak!, Please Login dulu..!");
    return;
  }

  const confirmDelete = confirm("Yakin hapus?");
  if (!confirmDelete) return;

  await remove(ref(db, PorsiBesar + "/" + id));
  alert("Berhasil dihapus");
};

const modal = document.getElementById("modalEdit");
const editName = document.getElementById("editName");
const editPrice = document.getElementById("editPrice");
const editDesc = document.getElementById("editDesc");

const editPorsi = document.getElementById("editPorsi");
const editKalori = document.getElementById("editKalori");

const editEnergi = document.getElementById("editEnergi");
const editProtein = document.getElementById("editProtein");
const editSerat = document.getElementById("editSerat");
const editKarbo = document.getElementById("editKarbo");
const editLemak = document.getElementById("editLemak");
const editNatrium = document.getElementById("editNatrium");

const editBahanUtama = document.getElementById("editBahanUtama");
const editAlergen = document.getElementById("editAlergen");

let selectedId = null;


window.editProduk = async function (id) {

  if (!isAdminLogin) {
    alert("Akses ditolak!");
    return;
  }

  selectedId = id;


  const snapshot = await get(ref(db, COLLECTION + "/" + id));

  if (!snapshot.exists()) {
    alert("Data tidak ditemukan");
    return;
  }

  oldImageUrl = image;

  const data = snapshot.val();

  editMenuImage.value = data.file || "";
  editName.value = data.name || "";
  editPrice.value = data.price || "";

  editPorsi.value = data.detail?.porsi || "";
  editDesc.value = data.detail?.desc || "";
  editKalori.value = data.detail?.kalori || "";

  editEnergi.value = data.detail?.gizi?.energi || "";
  editProtein.value = data.detail?.gizi?.protein || "";
  editSerat.value = data.detail?.gizi?.serat || "";
  editKarbo.value = data.detail?.gizi?.karbohidrat || "";
  editLemak.value = data.detail?.gizi?.lemak || "";
  editNatrium.value = data.detail?.gizi?.natrium || "";

  editBahanUtama.value =
    data.detail?.bahanUtama?.join(",") || "";

  editAlergen.value =
    data.detail?.alergen || "";

  modal.style.display = "block";
};

window.closeModal = function () {
  modal.style.display = "none";
};

const editMenuImage = document.getElementById("editMenuImage");
let oldImageUrl = "";

document.getElementById("btnUpdate")
  .addEventListener("click", async () => {


    const file = editMenuImage.files[0];

    let imageUrl = oldImageUrl;

    try {
      // kalau user pilih gambar baru
      if (file) {
        imageUrl = await uploadImage(file);
      }


      const name = editName.value;
      const price = editPrice.value;

      const porsi = editPorsi.value;
      const desc = editDesc.value;
      const kalori = editKalori.value;

      const energi = editEnergi.value;
      const protein = editProtein.value;
      const serat = editSerat.value;
      const karbohidrat = editKarbo.value;
      const lemak = editLemak.value;
      const natrium = editNatrium.value;

      const bahanUtama =
        editBahanUtama.value.split(",");

      const alergen = editAlergen.value;

      await update(
        ref(db, COLLECTION + "/" + selectedId),
        {
          image: imageUrl,
          name,
          price,

          detail: {
            porsi,
            desc,
            kalori,

            gizi: {
              energi,
              protein,
              serat,
              karbohidrat,
              lemak,
              natrium
            },

            bahanUtama,
            alergen
          }
        }
      );

      alert("Produk berhasil diupdate!");

      closeModal();
    } catch (error) {
      alert("Gagal update!");
    }
  });

//----------------Edit porsi Besar--------------
const modal2 = document.getElementById("modalEdit2");

const editMenuImage2 = document.getElementById("editMenuImage2");
let oldImageUrl2 = "";

const editName2 = document.getElementById("editName2");
const editPrice2 = document.getElementById("editPrice2");
const editDesc2 = document.getElementById("editDesc2");

const editPorsi2 = document.getElementById("editPorsi2");
const editKalori2 = document.getElementById("editKalori2");

const editEnergi2 = document.getElementById("editEnergi2");
const editProtein2 = document.getElementById("editProtein2");
const editSerat2 = document.getElementById("editSerat2");
const editKarbo2 = document.getElementById("editKarbo2");
const editLemak2 = document.getElementById("editLemak2");
const editNatrium2 = document.getElementById("editNatrium2");

const editBahanUtama2 = document.getElementById("editBahanUtama2");
const editAlergen2 = document.getElementById("editAlergen2");

let selectedId2 = null;

window.editProduk2 = async function (id) {

  if (!isAdminLogin) {
    alert("Akses ditolak!");
    return;
  }

  selectedId2 = id;

  const snapshot = await get(ref(db, PorsiBesar + "/" + id));

  if (!snapshot.exists()) {
    alert("Data tidak ditemukan");
    return;
  }

  const data = snapshot.val();
  
  oldImageUrl2 = image;

  editMenuImage.value = data.file || "";

  editName2.value = data.name || "";
  editPrice2.value = data.price || "";

  editPorsi2.value = data.detail?.porsi || "";
  editDesc2.value = data.detail?.desc || "";
  editKalori2.value = data.detail?.kalori || "";

  editEnergi2.value = data.detail?.gizi?.energi || "";
  editProtein2.value = data.detail?.gizi?.protein || "";
  editSerat2.value = data.detail?.gizi?.serat || "";
  editKarbo2.value = data.detail?.gizi?.karbohidrat || "";
  editLemak2.value = data.detail?.gizi?.lemak || "";
  editNatrium2.value = data.detail?.gizi?.natrium || "";

  editBahanUtama2.value =
    data.detail?.bahanUtama?.join(",") || "";

  editAlergen2.value =
    data.detail?.alergen || "";

  modal2.style.display = "block";
};

window.closeModal2 = function () {
  modal2.style.display = "none";
};

// --- Update porsi besar ---
document.getElementById("btnUpdate-2")
  .addEventListener("click", async () => {

    const file = editMenuImage2.files[0];

    let imageUrl2 = oldImageUrl2;

    try {
      // kalau user pilih gambar baru
      if (file) {
        imageUrl2 = await uploadImage(file);
      }

      const name = editName2.value;
      const price = editPrice2.value;

      const porsi = editPorsi2.value;
      const desc = editDesc2.value;
      const kalori = editKalori2.value;

      const energi = editEnergi2.value;
      const protein = editProtein2.value;
      const serat = editSerat2.value;
      const karbohidrat = editKarbo2.value;
      const lemak = editLemak2.value;
      const natrium = editNatrium2.value;

      const bahanUtama =
        editBahanUtama2.value.split(",");

      const alergen = editAlergen2.value;

      await update(
        ref(db, PorsiBesar + "/" + selectedId2),
        {
          image: imageUrl2,
          name,
          price,

          detail: {
            porsi,
            desc,
            kalori,

            gizi: {
              energi,
              protein,
              serat,
              karbohidrat,
              lemak,
              natrium
            },

            bahanUtama,
            alergen
          }
        }
      );

      alert("Produk berhasil diupdate!");

      closeModal2();
    } catch (error) {
      alert("Gagal update!");
    }
  });

//-------------------------------------


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



const tampilTmbMenu = document.querySelector(".tambProduk-con");
const tmbMenu = document.querySelector(".tmb-menu");

document.querySelector(".tmb-menu")
  .addEventListener("click", () => {
    if (tampilTmbMenu.style.display === "flex") {
      tampilTmbMenu.style.display = "none";
      tmbMenu.textContent = "➕Menu Porsi Kecil";
    } else {
      tampilTmbMenu.style.display = "flex";
      tampilTmbMenu2.style.display = "none";
      tmbMenu.textContent = "Minimize Form➖";
      tmbMenu2.textContent = "➕Menu Porsi Besar";
    }

  })

const tampilTmbMenu2 = document.querySelector(".tambProduk-con-2");
const tmbMenu2 = document.querySelector(".tmb-menu-2");

document.querySelector(".tmb-menu-2")
  .addEventListener("click", () => {
    if (tampilTmbMenu2.style.display === "flex") {
      tampilTmbMenu2.style.display = "none";
      tmbMenu2.textContent = "➕Menu Porsi Besar";
    } else {
      tampilTmbMenu2.style.display = "flex";
      tmbMenu2.textContent = "Minimize Form➖";
      tampilTmbMenu.style.display = "none";
      tmbMenu.textContent = "➕Menu Porsi Kecil";
    }

  })


// auto scroll langsung paling bawah
function scrollTopBottom() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth" //biar halus
  })
}

document.querySelector(".scroll-bawah")
  .addEventListener("click", scrollTopBottom);

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








