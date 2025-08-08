document.addEventListener('DOMContentLoaded', function () {
  // --- Filter Teknisi dan Tanggal
  const teknisiInput = document.getElementById('filter-teknisi');
  const tanggalInput = document.getElementById('filter-tanggal');
  const filterButtons = document.querySelectorAll('.filter-btn');

  // --- Tombol Form
  const btnTambah = document.getElementById("btnTambah");

  // --- Elemen Form dan Tabel
  const formModal = document.getElementById("formModal");
  const modalTitle = document.getElementById("modalTitle");
  const dataForm = document.getElementById("dataForm");
  const jadwalBody = document.getElementById("jadwal-body");

  let currentBarang = "Semua";
  let editId = null;

  function initializeData() {
    if (!localStorage.getItem('jadwalTeknisi')) {
      localStorage.setItem('jadwalTeknisi', JSON.stringify([]));
    }
  }

  function getData() {
    const data = localStorage.getItem('jadwalTeknisi');
    return data ? JSON.parse(data) : [];
  }

  function saveData(data) {
    localStorage.setItem('jadwalTeknisi', JSON.stringify(data));
  }

  function generateId() {
    const data = getData();
    return data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
  }

  function loadData(barang) {
    const data = getData();
    jadwalBody.innerHTML = "";

    const filteredData = data.filter(item => 
      barang === "Semua" || item.jenis_barang === barang
    );

    if (filteredData.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="10" style="text-align: center;">Tidak ada data untuk jenis barang ini.</td>`;
      jadwalBody.appendChild(tr);
    } else {
      filteredData.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.teknisi}</td>
          <td>${row.tanggal}</td>
          <td>${row.jam}</td>
          <td>${row.pekerjaan}</td>
          <td>${row.jenis_barang}</td>
          <td>${row.kerusakan}</td>
          <td>${row.estimasi_pengerjaan}</td>
          <td>Rp ${row.biaya.toLocaleString('id-ID')}</td>
          <td>${row.garansi}</td>
          <td>
            <button class="edit-btn" data-id="${row.id}">Edit</button>
            <button class="delete-btn" data-id="${row.id}">Hapus</button>
          </td>
        `;
        jadwalBody.appendChild(tr);
      });
    }
    filterTable();
    addDynamicButtons(); // penting agar event tombol edit/hapus berfungsi
  }

  function filterTable() {
    const teknisiFilter = teknisiInput.value.toLowerCase();
    const tanggalFilter = tanggalInput.value;
    const rows = document.querySelectorAll('#jadwal-body tr');

    rows.forEach(row => {
      const teknisi = row.cells[0].textContent.toLowerCase();
      const tanggal = row.cells[1].textContent;
      const barang = row.cells[4].textContent;

      const matchTeknisi = teknisi.includes(teknisiFilter);
      const matchTanggal = !tanggalFilter || tanggal === tanggalFilter;
      const matchBarang = currentBarang === "Semua" || barang === currentBarang;

      row.style.display = (matchTeknisi && matchTanggal && matchBarang) ? '' : 'none';
    });
  }

  function showModal(mode = 'tambah') {
    formModal.style.display = 'flex'; // Pakai flex agar bisa di-center
    modalTitle.textContent = mode === 'tambah' ? 'Tambah Data Teknisi' : 'Edit Data Teknisi';
    dataForm.reset();
    if (mode === 'tambah') editId = null;
  }

  function closeModal() {
    formModal.style.display = 'none';
    dataForm.reset();
    editId = null;
  }

  function handleSubmit(e) {
    e.preventDefault();
  
    const biayaValue = parseInt(document.getElementById('biaya').value);
    if (isNaN(biayaValue) || biayaValue < 0) {
      alert('Biaya harus berupa angka positif.');
      return;
    }
  
    let garansi = document.getElementById('garansi').value;
    garansi = garansi.toLowerCase().includes("bulan")
      ? garansi.replace(/bulan/i, "").trim() + " Bulan"
      : garansi + " Bulan";

      estimasi_pengerjaan = estimasi_pengerjaan.toLowerCase().includes("hari")
      ? estimasi_pengerjaan.replace(/hari/i, "").trim() + " Hari"
      : estimasi_pengerjaan + " Hari"
    
    const data = {
      teknisi: document.getElementById('teknisi').value,
      tanggal: document.getElementById('tanggal').value,
      jam: document.getElementById('jam').value,
      pekerjaan: document.getElementById('pekerjaan').value,
      jenis_barang: document.getElementById('jenis_barang').value,
      kerusakan: document.getElementById('kerusakan').value,
      estimasi_pengerjaan: estimasi_pengerjaan,
      biaya: biayaValue,
      garansi: garansi
    };
  
    const existingData = getData();
  
    if (editId) {
      const index = existingData.findIndex(item => item.id === editId);
      if (index !== -1) {
        data.id = editId;
        existingData[index] = data;
      }
    } else {
      data.id = generateId();
      existingData.push(data);
    }
  
    saveData(existingData);
    closeModal();
    loadData(currentBarang);
    alert('Data berhasil disimpan!');
  }
  

  function editData(id) {
    const data = getData();
    const item = data.find(item => item.id === id);
    if (item) {
      editId = id;
      document.getElementById('teknisi').value = item.teknisi;
      document.getElementById('tanggal').value = item.tanggal;
      document.getElementById('jam').value = item.jam;
      document.getElementById('pekerjaan').value = item.pekerjaan;
      document.getElementById('jenis_barang').value = item.jenis_barang;
      document.getElementById('kerusakan').value = item.kerusakan;
      document.getElementById('estimasi_pengerjaan').value = item.estimasi_pengerjaan;
      document.getElementById('biaya').value = item.biaya;
      document.getElementById('garansi').value = item.garansi;
      showModal('edit');
    }
  }

  function deleteData(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      const data = getData();
      const filteredData = data.filter(item => item.id !== id);
      saveData(filteredData);
      loadData(currentBarang);
    }
  }

  function addDynamicButtons() {
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        editData(id);
      });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        deleteData(id);
      });
    });
  }

  // Event listeners
  btnTambah.addEventListener('click', () => showModal('tambah'));
  dataForm.addEventListener('submit', handleSubmit);
  document.querySelector('.close').addEventListener('click', closeModal);
  window.addEventListener('click', (e) => {
    if (e.target === formModal) {
      closeModal();
    }
  });
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentBarang = button.dataset.barang;
      loadData(currentBarang);
    });
  });
  teknisiInput.addEventListener('input', filterTable);
  tanggalInput.addEventListener('input', filterTable);

  // Initialize
  initializeData();
  loadData("Semua");

  // --- Export Data ke Excel
document.getElementById('btnExport').addEventListener('click', () => {
  const data = getData();

  if (data.length === 0) {
    alert("Tidak ada data untuk diekspor.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Jadwal Teknisi");

  XLSX.writeFile(workbook, "jadwal_teknisi.xlsx");
});

// --- Import Data dari Excel
document.getElementById('btnImport').addEventListener('click', () => {
  document.getElementById('importExcel').click();
});

document.getElementById('importExcel').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const importedData = XLSX.utils.sheet_to_json(sheet);

    // Tambahkan ID jika belum ada
    importedData.forEach((item, index) => {
      if (!item.id) {
        item.id = Date.now() + index;
      }
    });

    // Gabungkan ke data yang sudah ada
    const existingData = getData();
    const combinedData = existingData.concat(importedData);
    saveData(combinedData);

    loadData(currentBarang);
    alert("Data berhasil diimpor.");
    e.target.value = ""; // reset input
  };

  reader.readAsArrayBuffer(file);
});

});
