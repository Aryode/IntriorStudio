import React, { useEffect } from 'react';

export default function TawkTo() {
  useEffect(() => {
    // Script Tawk.to
    var Tawk_API = Tawk_API || {};
    var Tawk_LoadStart = new Date();

    // Fungsi untuk menambahkan script ke dalam body dokumen
    (function() {
      var s1 = document.createElement("script");
      var s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      // Ganti dengan URL script Tawk.to Anda
      s1.src = 'https://embed.tawk.to/685ebb21e180a519142be157/1iup0luo5'; 
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s1.id = 'tawkto-script'; // Beri ID agar mudah ditemukan saat dihapus

      if (s0 && s0.parentNode) {
        s0.parentNode.insertBefore(s1, s0);
      }
    })();

    // Definisikan Tawk_API.onLoad jika belum ada
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.onLoad = function() {
        // Anda bisa melakukan sesuatu saat widget selesai dimuat
        // contoh: window.Tawk_API.maximize();
    };

    // Cleanup function: akan berjalan saat komponen dilepas (unmount)
    return () => {
      // Hapus script dan properti Tawk_API saat meninggalkan halaman publik
      const tawktoScript = document.getElementById('tawkto-script');
      if (tawktoScript && tawktoScript.parentNode) {
        tawktoScript.parentNode.removeChild(tawktoScript);
      }
      delete window.Tawk_API;
      delete window.Tawk_LoadStart;
      // Hapus juga widget iframe jika ada
      const tawkToWidget = document.querySelector('iframe[title="Tawk.to chat widget"]');
      if (tawkToWidget && tawkToWidget.parentNode) {
        tawkToWidget.parentNode.removeChild(tawkToWidget);
      }
    };

  }, []); // Array dependensi kosong agar script hanya dimuat sekali saat komponen pertama kali render

  return null; // Komponen ini tidak merender JSX apa pun
}