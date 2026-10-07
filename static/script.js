/* =====================================
   ELEMENTS
===================================== */

const algorithmSelect =
    document.getElementById("algorithm");

const plaintext =
    document.getElementById("plaintext");

const ciphertext =
    document.getElementById("ciphertext");

const key =
    document.getElementById("key");

const plainCount =
    document.getElementById("plainCount");

const cipherCount =
    document.getElementById("cipherCount");

const statusTitle =
    document.getElementById("statusTitle");

const statusDescription =
    document.getElementById("statusDescription");

const statusAlgorithm =
    document.getElementById("statusAlgorithm");

const statusKey =
    document.getElementById("statusKey");

const currentAlgorithm =
    document.getElementById("algorithmTitle");

const algorithmDescription =
    document.getElementById("algorithmDescription");

const infoDescription =
    document.getElementById("infoDescription");


/* =====================================
   ALGORITHM INFORMATION
===================================== */

const algorithms = {

    shift: {
        name: "Shift Cipher",
        description:
            "Simple alphabet shifting technique."
    },

    substitution: {
        name: "Substitution Cipher",
        description:
            "Replace characters using a custom mapping."
    },

    affine: {
        name: "Affine Cipher",
        description:
            "Combination of multiplication and shifting."
    },

    vigenere: {
        name: "Vigenere Cipher",
        description:
            "Polyalphabetic substitution cipher."
    },

    hill: {
        name: "Hill Cipher",
        description:
            "Matrix-based cryptographic algorithm."
    },

    permutation: {
        name: "Permutation Cipher",
        description:
            "Rearrange characters using a key."
    },

    otp: {
        name: "One-Time Pad",
        description:
            "Encryption using a random key sequence."
    }

};


/* =====================================
   CHARACTER COUNTER
===================================== */

function updateCounters() {

    plainCount.textContent =
        plaintext.value.length +
        " characters";

    cipherCount.textContent =
        ciphertext.value.length +
        " characters";
}

plaintext.addEventListener(
    "input",
    updateCounters
);

ciphertext.addEventListener(
    "input",
    updateCounters
);


/* =====================================
   ALGORITHM CHANGE
===================================== */

algorithmSelect.addEventListener(
    "change",
    function () {

        const selected =
            algorithmSelect.value;

        const data =
            algorithms[selected];

        currentAlgorithm.textContent =
            data.name;

        algorithmDescription.textContent =
            data.description;

        statusAlgorithm.textContent =
            data.name;


        if (selected === "shift") {

            infoDescription.textContent =
                "Shift Cipher adalah algoritma kriptografi sederhana yang bekerja dengan menggeser setiap huruf pada alfabet sejumlah posisi tertentu.";

        } else {

            infoDescription.textContent =
                data.description +
                " Algoritma ini akan tersedia setelah implementasinya selesai.";

        }

    }
);


/* =====================================
   SIDEBAR ALGORITHM
===================================== */

document
    .querySelectorAll(".algorithm-item")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const selected =
                    this.dataset.algorithm;

                algorithmSelect.value =
                    selected;

                algorithmSelect.dispatchEvent(
                    new Event("change")
                );


                document
                    .querySelectorAll(".algorithm-item")
                    .forEach(item =>
                        item.classList.remove("active")
                    );

                this.classList.add("active");

            }
        );

    });


/* =====================================
   ENCRYPT
===================================== */

async function encryptText() {

    const algorithm =
        algorithmSelect.value;

    const text =
        plaintext.value.trim();

    const encryptionKey =
        key.value.trim();


    if (!text) {

        showStatus(
            "Input Required",
            "Masukkan plaintext terlebih dahulu.",
            false
        );

        return;
    }


    if (!encryptionKey) {

        showStatus(
            "Key Required",
            "Masukkan encryption key terlebih dahulu.",
            false
        );

        return;
    }


    try {

        showStatus(
            "Processing...",
            "Sedang mengenkripsi pesan.",
            true
        );


        const response =
            await fetch("/encrypt", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    algorithm: algorithm,

                    plaintext: text,

                    key: encryptionKey

                })

            });


        const data =
            await response.json();


        if (!data.success) {

            showStatus(
                "Encryption Failed",
                data.message,
                false
            );

            return;
        }


        ciphertext.value =
            data.result;


        updateCounters();


        showStatus(
            "Encryption Successful",
            "Pesan berhasil dienkripsi.",
            true
        );


    } catch (error) {

        console.error(error);

        showStatus(
            "Connection Error",
            "Tidak dapat menghubungi Flask server.",
            false
        );

    }

}


/* =====================================
   DECRYPT
===================================== */

async function decryptText() {

    const algorithm =
        algorithmSelect.value;

    const encryptedText =
        ciphertext.value.trim();

    const encryptionKey =
        key.value.trim();


    if (!encryptedText) {

        showStatus(
            "Input Required",
            "Masukkan ciphertext terlebih dahulu.",
            false
        );

        return;
    }


    if (!encryptionKey) {

        showStatus(
            "Key Required",
            "Masukkan encryption key terlebih dahulu.",
            false
        );

        return;
    }


    try {

        showStatus(
            "Processing...",
            "Sedang mendekripsi pesan.",
            true
        );


        const response =
            await fetch("/decrypt", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    algorithm: algorithm,

                    ciphertext: encryptedText,

                    key: encryptionKey

                })

            });


        const data =
            await response.json();


        if (!data.success) {

            showStatus(
                "Decryption Failed",
                data.message,
                false
            );

            return;
        }


        plaintext.value =
            data.result;


        updateCounters();


        showStatus(
            "Decryption Successful",
            "Ciphertext berhasil dikembalikan ke plaintext.",
            true
        );


    } catch (error) {

        console.error(error);

        showStatus(
            "Connection Error",
            "Tidak dapat menghubungi Flask server.",
            false
        );

    }

}


/* =====================================
   STATUS
===================================== */

function showStatus(
    title,
    description,
    success
) {

    statusTitle.textContent =
        title;

    statusDescription.textContent =
        description;

    statusKey.textContent =
        key.value || "-";

    statusAlgorithm.textContent =
        algorithms[
            algorithmSelect.value
        ].name;


    const indicator =
        document.querySelector(
            ".success-indicator"
        );


    if (success) {

        indicator.style.background =
            "#00e6a7";

        indicator.style.boxShadow =
            "0 0 12px #00e6a7";

        statusTitle.style.color =
            "#00e6a7";

    } else {

        indicator.style.background =
            "#ff5577";

        indicator.style.boxShadow =
            "0 0 12px #ff5577";

        statusTitle.style.color =
            "#ff5577";

    }

}


/* =====================================
   CLEAR
===================================== */

function clearPlaintext() {

    plaintext.value = "";

    updateCounters();

}


function clearCiphertext() {

    ciphertext.value = "";

    updateCounters();

}


/* =====================================
   COPY
===================================== */

async function copyPlaintext() {

    if (!plaintext.value) {
        return;
    }

    await navigator.clipboard.writeText(
        plaintext.value
    );

    showStatus(
        "Copied",
        "Plaintext berhasil disalin.",
        true
    );

}


async function copyCiphertext() {

    if (!ciphertext.value) {
        return;
    }

    await navigator.clipboard.writeText(
        ciphertext.value
    );

    showStatus(
        "Copied",
        "Ciphertext berhasil disalin.",
        true
    );

}


/* =====================================
   MODE BUTTON
===================================== */

document
    .getElementById("encryptMode")
    .addEventListener(
        "click",
        function () {

            this.classList.add("active");

            document
                .getElementById("decryptMode")
                .classList.remove("active");

        }
    );


document
    .getElementById("decryptMode")
    .addEventListener(
        "click",
        function () {

            this.classList.add("active");

            document
                .getElementById("encryptMode")
                .classList.remove("active");

        }
    );


/* =====================================
   INITIALIZATION
===================================== */

updateCounters();

/* =====================================
   FILE UPLOAD
===================================== */

const fileInput =
    document.getElementById("fileInput");

const selectedFile =
    document.getElementById("selectedFile");

const fileStatus =
    document.getElementById("fileStatus");


fileInput.addEventListener(
    "change",
    function () {

        if (!this.files.length) {

            selectedFile.textContent =
                "Belum ada file dipilih.";

            return;
        }


        const file =
            this.files[0];


        const size =
            formatFileSize(file.size);


        selectedFile.innerHTML =
            "📄 <strong>" +
            file.name +
            "</strong> · " +
            size;


        fileStatus.innerHTML =
            '<span class="file-status-dot"></span>' +
            "<span>File siap diproses.</span>";

    }
);


/* =====================================
   FORMAT FILE SIZE
===================================== */

function formatFileSize(bytes) {

    if (bytes === 0) {
        return "0 Bytes";
    }

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];

    const index =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );

    return (
        parseFloat(
            (
                bytes /
                Math.pow(1024, index)
            ).toFixed(2)
        ) +
        " " +
        units[index]
    );
}


/* =====================================
   ENCRYPT FILE
===================================== */

async function encryptFile() {

    if (!fileInput.files.length) {

        fileStatus.innerHTML =
            '<span class="file-status-dot"></span>' +
            "<span>Pilih file terlebih dahulu.</span>";

        return;
    }


    const encryptionKey =
        key.value.trim();


    if (!encryptionKey) {

        fileStatus.innerHTML =
            '<span class="file-status-dot"></span>' +
            "<span>Masukkan encryption key.</span>";

        return;
    }


    const formData =
        new FormData();


    formData.append(
        "file",
        fileInput.files[0]
    );


    formData.append(
        "algorithm",
        algorithmSelect.value
    );


    formData.append(
        "key",
        encryptionKey
    );


    formData.append(
        "mode",
        "encrypt"
    );


    try {

        fileStatus.innerHTML =
            '<span class="file-status-dot"></span>' +
            "<span>Encrypting file...</span>";


        const response =
            await fetch(
                "/process-file",
                {
                    method: "POST",
                    body: formData
                }
            );


        if (!response.ok) {

            const error =
                await response.json();

            throw new Error(
                error.message
            );
        }


        const blob =
            await response.blob();


        downloadBlob(
            blob,
            "encrypted_" +
            fileInput.files[0].name
        );


        fileStatus.innerHTML =
            '<span class="file-status-dot"></span>' +
            "<span>✓ File berhasil dienkripsi dan di-download.</span>";


    } catch (error) {

        console.error(error);

        fileStatus.innerHTML =
            '<span class="file-status-dot"></span>' +
            "<span>❌ " +
            error.message +
            "</span>";
    }

}


/* =====================================
   DECRYPT FILE
===================================== */

async function decryptFile() {

    if (!fileInput.files.length) {

        fileStatus.innerHTML =
            '<span class="file-status-dot"></span>' +
            "<span>Pilih ciphertext file terlebih dahulu.</span>";

        return;
    }


    const encryptionKey =
        key.value.trim();


    if (!encryptionKey) {

        fileStatus.innerHTML =
            '<span class="file-status-dot"></span>' +
            "<span>Masukkan encryption key.</span>";

        return;
    }


    const formData =
        new FormData();


    formData.append(
        "file",
        fileInput.files[0]
    );


    formData.append(
        "algorithm",
        algorithmSelect.value
    );


    formData.append(
        "key",
        encryptionKey
    );


    formData.append(
        "mode",
        "decrypt"
    );


    try {

        fileStatus.innerHTML =
            '<span class="file-status-dot"></span>' +
            "<span>Decrypting file...</span>";


        const response =
            await fetch(
                "/process-file",
                {
                    method: "POST",
                    body: formData
                }
            );


        if (!response.ok) {

            const error =
                await response.json();

            throw new Error(
                error.message
            );
        }


        const blob =
            await response.blob();


        downloadBlob(
            blob,
            "decrypted_" +
            fileInput.files[0].name
        );


        fileStatus.innerHTML =
            '<span class="file-status-dot"></span>' +
            "<span>✓ File berhasil didekripsi dan di-download.</span>";


    } catch (error) {

        console.error(error);

        fileStatus.innerHTML =
            '<span class="file-status-dot"></span>' +
            "<span>❌ " +
            error.message +
            "</span>";
    }

}


/* =====================================
   DOWNLOAD
===================================== */

function downloadBlob(
    blob,
    filename
) {

    const url =
        window.URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        filename;


    document.body.appendChild(link);

    link.click();

    link.remove();


    window.URL.revokeObjectURL(url);
}