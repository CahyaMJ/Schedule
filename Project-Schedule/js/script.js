  document.addEventListener("DOMContentLoaded", function () {
  const btnTambah = document.getElementById("btnTambah");
  const formModal = document.getElementById("formModal");
  const closeBtn = document.querySelector(".close-btn");
  const dataForm = document.getElementById("dataForm");
  const tbody = document.getElementById("jadwal-body");

  const btnImport = document.getElementById("btnImport");
  const btnExport = document.getElementById("btnExport");
  const importExcel = document.getElementById("importExcel");

  const teknisiInput = document.getElementById("filter-teknisi");
  const tanggalInput = document.getElementById("filter-tanggal");

  let dataTeknisi = JSON.parse(localStorage.getItem("dataTeknisi")) || [];

  function saveData() {
    localStorage.setItem("dataTeknisi", JSON.stringify(dataTeknisi));
  }

  function loadData() {
    tbody.innerHTML = "";
    dataTeknisi.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.teknisi}</td>
        <td>${item.tanggal}</td>
        <td>${item.jam}</td>
        <td>${item.pekerjaan}</td>
        <td>${item.jenis_barang}</td>
        <td>${item.kerusakan}</td>
        <td>${item.estimasi_pengerjaan}</td>
        <td>${item.biaya}</td>
        <td>${item.garansi}</td>
        <td>
          <button class="btn-edit" data-index="${index}">Edit</button>
          <button class="btn-hapus" data-index="${index}">Hapus</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    filterTable(teknisiInput.value, tanggalInput.value);
  }

  function filterTable(teknisiFilter, tanggalFilter) {
    const rows = document.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      const teknisiCell = row.querySelector("td:nth-child(1)");
      const tanggalCell = row.querySelector("td:nth-child(2)");

      if (!teknisiCell || !tanggalCell) return;

      const teknisi = teknisiCell.textContent.toLowerCase();
      const tanggal = tanggalCell.textContent;

      const matchTeknisi = teknisiFilter === "" || teknisi.includes(teknisiFilter.toLowerCase());
      const matchTanggal = tanggalFilter === "" || tanggal === tanggalFilter;

      row.style.display = matchTeknisi && matchTanggal ? "" : "none";
    });
  }

  function resetForm() {
    dataForm.reset();
    document.getElementById("editId").value = "";
  }

  btnTambah.addEventListener("click", () => {
    formModal.style.display = "block";
    document.getElementById("modalTitle").textContent = "Tambah Data Teknisi";
    resetForm();
  });

  closeBtn.addEventListener("click", () => {
    formModal.style.display = "none";
  });

  window.addEventListener("click", function (e) {
    if (e.target === formModal) {
      formModal.style.display = "none";
    }
  });

  dataForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const editId = document.getElementById("editId").value;

    const newItem = {
      teknisi: dataForm.teknisi.value,
      tanggal: dataForm.tanggal.value,
      jam: dataForm.jam.value,
      pekerjaan: dataForm.pekerjaan.value,
      jenis_barang: dataForm.jenis_barang.value,
      kerusakan: dataForm.kerusakan.value,
      estimasi_pengerjaan: dataForm.estimasi_pengerjaan.value,
      biaya: dataForm.biaya.value,
      garansi: dataForm.garansi.value,
    };

    if (editId === "") {
      dataTeknisi.push(newItem);
    } else {
      dataTeknisi[parseInt(editId)] = newItem;
    }

    saveData();
    loadData();
    formModal.style.display = "none";
  });

  tbody.addEventListener("click", function (e) {
    const index = e.target.dataset.index;
    if (e.target.classList.contains("btn-hapus")) {
      if (confirm("Yakin ingin menghapus data ini?")) {
        dataTeknisi.splice(index, 1);
        saveData();
        loadData();
      }
    } else if (e.target.classList.contains("btn-edit")) {
      const item = dataTeknisi[index];
      document.getElementById("editId").value = index;
      dataForm.teknisi.value = item.teknisi;
      dataForm.tanggal.value = item.tanggal;
      dataForm.jam.value = item.jam;
      dataForm.pekerjaan.value = item.pekerjaan;
      dataForm.jenis_barang.value = item.jenis_barang;
      dataForm.kerusakan.value = item.kerusakan;
      dataForm.estimasi_pengerjaan.value = item.estimasi_pengerjaan;
      dataForm.biaya.value = item.biaya;
      dataForm.garansi.value = item.garansi;

      formModal.style.display = "block";
      document.getElementById("modalTitle").textContent = "Edit Data Teknisi";
    }
  });

  teknisiInput.addEventListener("input", () => {
    filterTable(teknisiInput.value, tanggalInput.value);
  });

  tanggalInput.addEventListener("input", () => {
    filterTable(teknisiInput.value, tanggalInput.value);
  });

  // Export ke Excel
  btnExport.addEventListener("click", function () {
    const ws = XLSX.utils.json_to_sheet(dataTeknisi);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Jadwal Teknisi");
    XLSX.writeFile(wb, "jadwal_teknisi.xlsx");
  });

  // Import Excel
  btnImport.addEventListener("click", () => importExcel.click());

  importExcel.addEventListener("change", function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const importedData = XLSX.utils.sheet_to_json(worksheet);

      dataTeknisi = importedData;
      saveData();
      loadData();
    };

    reader.readAsArrayBuffer(file);
  });

  loadData();
});

