document.addEventListener('DOMContentLoaded', function () {
    loadBooks();
});

function tambahBuku() {
    const judul = document.getElementById('judul').value;
    const pengarang = document.getElementById('pengarang').value;
    const tahun = document.getElementById('tahun').value;
    const sudahSelesai = document.getElementById('selesai').checked;

    if (judul && pengarang && tahun) {
        const bukuBaru = {
            id: +new Date(),
            judul,
            pengarang,
            tahun: parseInt(tahun),
            sudahSelesai
        };

        const bukuRak = ambilBuku();
        bukuRak.push(bukuBaru);
        simpanBuku(bukuRak);

        bersihkanForm();
        loadBooks();
    } else {
        alert('Mohon isi semua kolom.');
    }
}

function loadBooks() {
    const belumSelesaiList = document.getElementById('belum-selesai-list');
    const selesaiList = document.getElementById('selesai-list');

    const bukuRak = ambilBuku();
    belumSelesaiList.innerHTML = '';
    selesaiList.innerHTML = '';

    bukuRak.forEach(buku => {
        const li = buatItemBuku(buku);
        if (buku.sudahSelesai) {
            selesaiList.appendChild(li);
        } else {
            belumSelesaiList.appendChild(li);
        }
    });
}

function pindahKeRak(idBuku, sudahSelesai) {
    const bukuRak = ambilBuku();
    const indexBuku = bukuRak.findIndex(buku => buku.id === idBuku);

    if (indexBuku !== -1) {
        bukuRak[indexBuku].sudahSelesai = sudahSelesai;
        simpanBuku(bukuRak);
        loadBooks();
    }
}

function hapusBuku(idBuku) {
    if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
        const bukuRak = ambilBuku();
        const bukuTerbaru = bukuRak.filter(buku => buku.id !== idBuku);
        simpanBuku(bukuTerbaru);
        loadBooks();
    }
}

function tampilkanFormEdit(idBuku) {
    const bukuRak = ambilBuku();
    const bukuDiedit = bukuRak.find(buku => buku.id === idBuku);

    if (bukuDiedit) {
        const formEdit = `
            <label for="judul-edit">Judul:</label>
            <input type="text" id="judul-edit" value="${bukuDiedit.judul}">

            <label for="pengarang-edit">Pengarang:</label>
            <input type="text" id="pengarang-edit" value="${bukuDiedit.pengarang}">

            <label for="tahun-edit">Tahun Terbit:</label>
            <input type="number" id="tahun-edit" value="${bukuDiedit.tahun}">

            <button onclick="simpanEdit(${bukuDiedit.id})">Simpan</button>
            <button onclick="batalEdit()">Batal</button>
        `;

        const formEditContainer = document.getElementById('form-edit');
        formEditContainer.innerHTML = formEdit;
    }
}

function batalEdit() {
    bersihkanFormEdit();
}

function simpanEdit(idBuku) {
    const judulBaru = document.getElementById('judul-edit').value;
    const pengarangBaru = document.getElementById('pengarang-edit').value;
    const tahunBaru = document.getElementById('tahun-edit').value;

    if (judulBaru && pengarangBaru && tahunBaru) {
        const bukuRak = ambilBuku();
        const indexBuku = bukuRak.findIndex(buku => buku.id === idBuku);

        if (indexBuku !== -1) {
            bukuRak[indexBuku].judul = judulBaru;
            bukuRak[indexBuku].pengarang = pengarangBaru;
            bukuRak[indexBuku].tahun = parseInt(tahunBaru);

            simpanBuku(bukuRak);
            loadBooks();
        }

        bersihkanFormEdit();
    } else {
        alert('Mohon isi semua kolom.');
    }
}

function bersihkanFormEdit() {
    const formEditContainer = document.getElementById('form-edit');
    formEditContainer.innerHTML = '';
}

function buatItemBuku(buku) {
    const li = document.createElement('li');
    li.innerHTML = `<span>${buku.judul} oleh ${buku.pengarang} (${buku.tahun})</span>
                    <span>
                        <button onclick="pindahKeRak(${buku.id}, ${!buku.sudahSelesai})">
                            ${buku.sudahSelesai ? 'Belum Selesai' : 'Selesai'}
                        </button>
                        <button onclick="tampilkanFormEdit(${buku.id})">Edit</button>
                        <button onclick="hapusBuku(${buku.id})">Hapus</button>
                    </span>`;
    return li;
}

function cariBuku() {
    const kataKunci = document.getElementById('cari').value.toLowerCase();
    const bukuRak = ambilBuku();
    const bukuDifilter = bukuRak.filter(buku => buku.judul.toLowerCase().includes(kataKunci));
    tampilkanBukuDifilter(bukuDifilter);
}

function tampilkanBukuDifilter(bukuDifilter) {
    const belumSelesaiList = document.getElementById('belum-selesai-list');
    const selesaiList = document.getElementById('selesai-list');
    
    belumSelesaiList.innerHTML = '';
    selesaiList.innerHTML = '';

    bukuDifilter.forEach(buku => {
        const li = buatItemBuku(buku);
        if (buku.sudahSelesai) {
            selesaiList.appendChild(li);
        } else {
            belumSelesaiList.appendChild(li);
        }
    });
}

function ambilBuku() {
    const bukuRakJSON = localStorage.getItem('buku');
    return bukuRakJSON ? JSON.parse(bukuRakJSON) : [];
}

function simpanBuku(bukuRak) {
    localStorage.setItem('buku', JSON.stringify(bukuRak));
}

function bersihkanForm() {
    document.getElementById('judul').value = '';
    document.getElementById('pengarang').value = '';
    document.getElementById('tahun').value = '';
    document.getElementById('selesai').checked = false;
}
