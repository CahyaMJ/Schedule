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

  // Initialize localStorage with empty array if not present
  function initializeData() {
    if (!localStorage.getItem('jadwalTeknisi')) {
      localStorage.setItem('jadwalTeknisi', JSON.stringify([]));
    }
  }

  // Get data from localStorage
  function getData() {
    const data = localStorage.getItem('jadwalTeknisi');
    return data ? JSON.parse(data) : [];
  }

  // Save data to localStorage
  function saveData(data) {
    localStorage.setItem('jadwalTeknisi', JSON.stringify(data));
  }

  // Generate unique ID
  function generateId() {
    const data = getData();
    return data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
  }

  // Load and display data
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
  }

  // Filter table based on current filters
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

      if (matchTeknisi && matchTanggal && matchBarang) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  // Show modal form
  function showModal(mode = 'tambah') {
    formModal.style.display = 'block';
    modalTitle.textContent = mode === 'tambah' ? 'Tambah Data Teknisi' : 'Edit Data Teknisi';
    dataForm.reset();
    editId = null;
  }

  // Close modal
  function closeModal() {
    formModal.style.display = 'none';
    dataForm.reset();
    editId = null;
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    
    const data = {
      teknisi: document.getElementById('teknisi').value,
      tanggal: document.getElementById('tanggal').value,
      jam: document.getElementById('jam').value,
      pekerjaan: document.getElementById('pekerjaan').value,
      jenis_barang: document.getElementById('jenis_barang').value,
      kerusakan: document.getElementById('kerusakan').value,
      estimasi_pengerjaan: document.getElementById('estimasi_pengerjaan').value,
      biaya: parseInt(document.getElementById('biaya').value),
      garansi: document.getElementById('garansi').value
    };

    const existingData = getData();
    
    if (editId) {
      // Edit existing data
      const index = existingData.findIndex(item => item.id === editId);
      if (index !== -1) {
        data.id = editId;
        existingData[index] = data;
      }
    } else {
      // Add new data
      data.id = generateId();
      existingData.push(data);
    }
    
    saveData(existingData);
    closeModal();
    loadData(currentBarang);
    alert('Data berhasil disimpan!');
  }

  // Edit data
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

  // Delete data
  function deleteData(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      const data = getData();
      const filteredData = data.filter(item => item.id !== id);
      saveData(filteredData);
      loadData(currentBarang);
    }
  }

  // Event listeners
  btnTambah.addEventListener('click', () => showModal('tambah'));
  dataForm.addEventListener('submit', handleSubmit);
  
  // Close modal when clicking X
  document.querySelector('.close').addEventListener('click', closeModal);
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === formModal) {
      closeModal();
    }
  });

  // Filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentBarang = button.dataset.barang;
      loadData(currentBarang);
    });
  });

  // Filter inputs
  teknisiInput.addEventListener('input', filterTable);
  tanggalInput.addEventListener('input', filterTable);

  // Initialize
  initializeData();
  loadData("Semua");
});

document.addEventListener('DOMContentLoaded', function () {
    // ... existing code ...
  
    // Show modal form
    function showModal(mode = 'tambah') {
      formModal.style.display = 'flex'; // Change to flex for centering
      modalTitle.textContent = mode === 'tambah' ? 'Tambah Data Teknisi' : 'Edit Data Teknisi';
      dataForm.reset();
      editId = null;
    }
  
    // Close modal
    function closeModal() {
      formModal.style.display = 'none';
      dataForm.reset();
      editId = null;
    }
  
    // Handle form submission
    function handleSubmit(e) {
      e.preventDefault();
      
      // Validate form data
      const biayaValue = parseInt(document.getElementById('biaya').value);
      if (isNaN(biayaValue) || biayaValue < 0) {
        alert('Biaya harus berupa angka positif.');
        return;
      }
  
      const data = {
        teknisi: document.getElementById('teknisi').value,
        tanggal: document.getElementById('tanggal').value,
        jam: document.getElementById('jam').value,
        pekerjaan: document.getElementById('pekerjaan').value,
        jenis_barang: document.getElementById('jenis_barang').value,
        kerusakan: document.getElementById('kerusakan').value,
        estimasi_pengerjaan: document.getElementById('estimasi_pengerjaan').value,
        biaya: biayaValue,
        garansi: document.getElementById('garansi').value
      };
  
      // ... existing code ...
    }
  
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === formModal) {
        closeModal();
      }
    });
  
    // Initialize
    initializeData();
    loadData("Semua");
  });
  