document.addEventListener('DOMContentLoaded', () => {
    // Efek pada Hero Section (jika masih relevan, sesuaikan)
    const heroOverlay = document.querySelector('.hero-background-overlay');
    if (heroOverlay) {
        // Memastikan overlay terlihat (CSS sudah mengatur transisi opacity)
        // Jika ada JS yang mengontrol opacity-nya, bisa disesuaikan di sini
        setTimeout(() => { // Memberi waktu untuk elemen lain load
            heroOverlay.style.opacity = '1';
        }, 100); 
    }

    // --- LOGIKA UNTUK PAKET WISATA POPUP ---
    const paketItems = document.querySelectorAll('.paket-item');
    const popup = document.getElementById('paket-popup');
    const popupImage = document.getElementById('popup-image');
    const popupTitle = document.getElementById('popup-title');
    const popupPrice = document.getElementById('popup-price');
    const popupDetails = document.getElementById('popup-details');
    // Pastikan popupPesanButton adalah variabel untuk tag <a>
    const popupPesanButton = document.getElementById('popup-pesan-button'); 
    const closePopupButton = document.getElementById('close-popup-button');

    if (paketItems.length && popup && closePopupButton) {
        paketItems.forEach(item => {
            item.addEventListener('click', () => {
                // Ambil data dari atribut data-*
                const imgSrc = item.dataset.imageSrc;
                const title = item.dataset.title; // Ini adalah nama paket wisatanya
                const price = item.dataset.price;
                const details = item.dataset.details;

                // Isi konten popup
                if (popupImage) popupImage.src = imgSrc;
                if (popupTitle) popupTitle.textContent = title;
                if (popupPrice) popupPrice.textContent = price;
                if (popupDetails) popupDetails.textContent = details;

                // --- MODIFIKASI UNTUK TOMBOL PESAN KE WHATSAPP ---
                if (popupPesanButton) {
                    const nomorWhatsApp = "6285930478524"; // Nomor WhatsApp Anda
                    // Pesan default yang menyertakan nama paket wisata
                    const pesanDefault = `Halo, saya ingin booking paket wisata: ${title}. Mohon informasinya.`; 
                    // URL encode pesan tersebut agar aman digunakan di URL
                    const encodedPesan = encodeURIComponent(pesanDefault);
                    
                    // Buat link WhatsApp lengkap
                    const linkWhatsApp = `https://wa.me/${nomorWhatsApp}?text=${encodedPesan}`;
                    
                    // Atur href tombol "Pesan Sekarang"
                    popupPesanButton.href = linkWhatsApp;
                }

                // Tampilkan popup
                popup.classList.add('active');
                document.body.style.overflow = 'hidden'; // Mencegah scroll background
            });
        });

        // Fungsi untuk menutup popup
        const closeThePopup = () => {
            popup.classList.remove('active');
            document.body.style.overflow = ''; // Kembalikan scroll background
        };

        closePopupButton.addEventListener('click', closeThePopup);

        // Opsional: Tutup popup saat klik di luar area konten popup
        popup.addEventListener('click', (e) => {
            if (e.target === popup) { // Jika yang diklik adalah overlay popup
                closeThePopup();
            }
        });

        // Opsional: Tutup popup dengan tombol Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && popup.classList.contains('active')) {
                closeThePopup();
            }
        });
    } 
    else {
        console.warn('Elemen paket wisata atau popup tidak ditemukan. Fitur popup mungkin tidak berfungsi.');
    }
    
    // --- TOMBOL PESAN SEKARANG (Contoh Aksi) ---
    if (popupPesanButton) {
        popupPesanButton.addEventListener('click', () => {
            const paketYangDipesan = popupTitle.textContent; // Ambil judul dari popup
            alert(`Anda akan memesan: ${paketYangDipesan}\nSilahkan Menghubungi Service Center Kami.`);
            // Di sini Anda bisa mengarahkan ke halaman WhatsApp, form kontak, atau sistem booking
        });
    }

    // --- SMOOTH SCROLL UNTUK NAVIGASI ---
    document.querySelectorAll('nav a[href^="#"], .footer-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Pastikan href bukan hanya "#" atau tidak valid
            if (href && href.startsWith('#') && href.length > 1) {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault(); // Hanya prevent default jika target valid
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Update tahun di footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Animasi untuk section saat di-scroll (opsional, contoh untuk .content-placeholder)
    const sectionsToAnimate = document.querySelectorAll('.content-placeholder, .paket-wisata-container');
    if (sectionsToAnimate.length > 0) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    // observer.unobserve(entry.target); // Hentikan observasi setelah animasi pertama
                }
            });
        }, { threshold: 0.1 }); // Munculkan saat 10% section terlihat

        sectionsToAnimate.forEach(section => {
            // Atur state awal sebelum animasi
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            observer.observe(section);
        });
    }

});

document.addEventListener('DOMContentLoaded', () => {
    // ... (kode JavaScript Anda yang sudah ada untuk menu, popup paket, dll.) ...

    // === SCRIPT BARU UNTUK GALERI INTERAKTIF ===
    const galleryLinks = document.querySelectorAll('.gallery-item .gallery-link');
    const popup = document.getElementById('interactiveGalleryPopup');
    const popupImage = document.getElementById('igpImage');
    const popupCaption = document.getElementById('igpCaption');
    const closeBtn = document.getElementById('igpCloseBtn');
    const nextBtn = document.getElementById('igpNextBtn');
    const prevBtn = document.getElementById('igpPrevBtn');

    let galleryData = [];
    let currentIndex = 0;

    if (galleryLinks.length > 0 && popup && popupImage && popupCaption && closeBtn && nextBtn && prevBtn) {

        galleryLinks.forEach(link => {
            galleryData.push({
                src: link.href, // URL gambar besar
                title: link.dataset.title || '' // Caption dari data-title
            });
        });

        function loadImage(index) {
            if (index < 0 || index >= galleryData.length) return;
            
            const item = galleryData[index];
            currentIndex = index;

            popupImage.classList.remove('igp-loaded');
            popupCaption.classList.remove('igp-loaded');

            setTimeout(() => {
                popupImage.src = item.src;
                popupCaption.textContent = item.title;

                // Gunakan image preloader untuk memastikan gambar termuat sebelum animasi masuk
                const tempImg = new Image();
                tempImg.onload = () => {
                    popupImage.classList.add('igp-loaded');
                    popupCaption.classList.add('igp-loaded');
                };
                tempImg.onerror = () => { // Jika gambar gagal dimuat
                    console.error("Gagal memuat gambar:", item.src);
                    popupCaption.textContent = "Gagal memuat gambar.";
                    popupImage.classList.add('igp-loaded'); // Tetap tampilkan caption error
                    popupCaption.classList.add('igp-loaded');
                };
                tempImg.src = item.src;
                // Jika gambar sudah di cache, onload mungkin tidak terpicu dengan cepat
                if (tempImg.complete && tempImg.naturalHeight > 0) {
                     setTimeout(() => {
                        popupImage.classList.add('igp-loaded');
                        popupCaption.classList.add('igp-loaded');
                     }, 50);
                }


            }, 150); // Waktu untuk transisi keluar (opacity 0, scale kecil)

            prevBtn.disabled = (currentIndex === 0);
            nextBtn.disabled = (currentIndex === galleryData.length - 1);
        }

        function openPopup(index) {
            popup.classList.add('igp-active');
            document.body.style.overflow = 'hidden';
            loadImage(index);
        }

        function closePopup() {
            popup.classList.remove('igp-active');
            document.body.style.overflow = '';
            setTimeout(() => {
                popupImage.src = ''; // Kosongkan src untuk menghemat memori
                popupCaption.textContent = '';
                popupImage.classList.remove('igp-loaded');
                popupCaption.classList.remove('igp-loaded');
            }, 300); // Sesuaikan dengan durasi transisi opacity popup
        }

        galleryLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                openPopup(index);
            });
        });

        closeBtn.addEventListener('click', closePopup);
        nextBtn.addEventListener('click', () => {
            if (currentIndex < galleryData.length - 1) {
                loadImage(currentIndex + 1);
            }
        });
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                loadImage(currentIndex - 1);
            }
        });

        popup.addEventListener('click', (e) => {
            if (e.target === popup) { 
                closePopup();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (popup.classList.contains('igp-active')) {
                if (e.key === 'Escape') {
                    closePopup();
                } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
                    nextBtn.click();
                } else if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
                    prevBtn.click();
                }
            }
        });

    } else {
        console.warn("Elemen HTML untuk galeri interaktif tidak lengkap.");
    }
    // === AKHIR SCRIPT GALERI INTERAKTIF ===
});