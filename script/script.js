

const humburger = document.getElementById("hamburger");
const menu = document.getElementById("navLink");

humburger.addEventListener("click", () => {
  menu.classList.toggle("active");

  if (humburger.innerText === "☰") {
    humburger.textContent = "x";
  } else {
    humburger.textContent = "☰";
  }
})

document.querySelectorAll(".nav-link li")
  .forEach(item => {
    item.addEventListener("click", () => {
      menu.classList.remove("active");
      humburger.textContent = "☰";
    })
  })

// ---------Konten KOde ----------------------------
let slideIndex = 0;
let intervalId = null;
let slides = []; // Kosong dulu, diisi setelah Firebase load

function initializeSlide() {
  // Query SETELAH gambar dari Firebase sudah ada di DOM
  slides = document.querySelectorAll(".slides img");

  if (slides.length > 0) {
    slides[slideIndex].classList.add("displaySlide");
    intervalId = setInterval(nextSlide, 5000);
  }
}

function showSlide(index) {
  if (index >= slides.length) {
    slideIndex = 0;
  } else if (index < 0) {
    slideIndex = slides.length - 1;
  }

  slides.forEach(slide => {
    slide.classList.remove("displaySlide");
  });

  slides[slideIndex].classList.add("displaySlide");
}

function prevSlide() {
  clearInterval(intervalId);
  slideIndex--;
  showSlide(slideIndex);
}

function nextSlide() {
  slideIndex++;
  showSlide(slideIndex);
}

// ---- jadwal pengantaran-------

document.addEventListener("DOMContentLoaded", function () {
  const hariIni = new Date().getDay(); // 0=Minggu,1=Senin,...,6=Sabtu

  const hariMap = {
    "Senin": 1,
    "Selasa": 2,
    "Rabu": 3,
    "Kamis": 4,
    "Jumat": 5,
    "Sabtu": 6
  };

  document.querySelectorAll(".hari-chip").forEach(chip => {
    const namaHari = chip.textContent.trim();
    if (hariMap[namaHari] === hariIni) {
      chip.classList.add("hari-ini");
      chip.textContent = namaHari + " ✦ Hari Ini";
    }
  });
});

