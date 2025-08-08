document.addEventListener("DOMContentLoaded", function () {
  const teknisiInput = document.getElementById("filter-teknisi");
  const tanggalInput = document.getElementById("filter-tanggal");
  const tambahForm = document.getElementById("tambahForm");
  const tbody = document.querySelector("tbody");

  let dataTeknisi = JSON.parse(localStorage.getItem("dataTeknisi")) || [];

  function saveData() {
    localStorage.setItem("dataTeknisi", JSON.stringify(dataTeknisi));
  }

  function loadData() {
    tbody.innerHTML = "";
    dataTeknisi.forEach((item, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.teknisi}</td>
        <td>${item.tanggal}</td>
        <td>${item.barang}</td>
        <td>${item.kerusakan}</td>
        <td>${item.perbaikan}</td>
        <td>${item.estimasi}</td>
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
      const teknisiCell = row.querySelector("td:nth-child(2)");
      const tanggalCell = row.querySelector("td:nth-child(3)");

      if (!teknisiCell || !tanggalCell) return;

      const teknisi = teknisiCell.textContent.toLowerCase();
      const tanggal = tanggalCell.textContent;

      const matchTeknisi =
        teknisiFilter === "" || teknisi.includes(teknisiFilter.toLowerCase());
      const matchTanggal = tanggalFilter === "" || tanggal === tanggalFilter;

      row.style.display = matchTeknisi && matchTanggal ? "" : "none";
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const form = tambahForm;

    const newItem = {
      teknisi: form.teknisi.value,
      tanggal: form.tanggal.value,
      barang: form.barang.value,
      kerusakan: form.kerusakan.value,
      perbaikan: form.perbaikan.value,
      estimasi: (form.estimasi.value || "").toString(),
    };

    dataTeknisi.push(newItem);
    saveData();
    loadData();
    form.reset();
  }

  tambahForm.addEventListener("submit", handleSubmit);

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
      tambahForm.teknisi.value = item.teknisi;
      tambahForm.tanggal.value = item.tanggal;
      tambahForm.barang.value = item.barang;
      tambahForm.kerusakan.value = item.kerusakan;
      tambahForm.perbaikan.value = item.perbaikan;
      tambahForm.estimasi.value = item.estimasi;

      dataTeknisi.splice(index, 1); // remove old
    }
  });

  teknisiInput.addEventListener("input", () => {
    filterTable(teknisiInput.value, tanggalInput.value);
  });

  tanggalInput.addEventListener("input", () => {
    filterTable(teknisiInput.value, tanggalInput.value);
  });

  loadData();
});
