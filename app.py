from flask import (
    Flask,
    render_template,
    request,
    jsonify,
    send_file
)

import io

from cipher import (
    shift_encrypt,
    shift_decrypt,
    substitution_encrypt,
    substitution_decrypt,
    affine_encrypt,
    affine_decrypt
)


app = Flask(__name__)


# =====================================
# HALAMAN UTAMA
# =====================================

@app.route("/")
def index():

    return render_template(
        "index.html"
    )


# =====================================
# TEXT ENCRYPTION
# =====================================

@app.route("/encrypt", methods=["POST"])
def encrypt():

    data = request.get_json()

    algorithm = data.get("algorithm")
    plaintext = data.get("plaintext")
    key = data.get("key")


    try:

        # =================================
        # SHIFT CIPHER
        # =================================

        if algorithm == "shift":

            key = int(key)

            ciphertext = shift_encrypt(
                plaintext,
                key
            )

            return jsonify({
                "success": True,
                "result": ciphertext
            })


        # =================================
        # SUBSTITUTION CIPHER
        # =================================

        if algorithm == "substitution":

            key = key.lower()


            if len(key) != 26:

                return jsonify({
                    "success": False,
                    "message":
                    "Key Substitution harus terdiri dari 26 huruf."
                })


            if not key.isalpha():

                return jsonify({
                    "success": False,
                    "message":
                    "Key hanya boleh berisi huruf."
                })


            if len(set(key)) != 26:

                return jsonify({
                    "success": False,
                    "message":
                    "Setiap huruf pada key harus berbeda."
                })


            ciphertext = substitution_encrypt(
                plaintext,
                key
            )

            return jsonify({
                "success": True,
                "result": ciphertext
            })


        # =================================
        # AFFINE CIPHER
        # =================================

        if algorithm == "affine":

            parts = key.split(",")


            if len(parts) != 2:

                return jsonify({
                    "success": False,
                    "message":
                    "Key Affine harus berupa a,b. Contoh: 5,8"
                })


            a = int(
                parts[0].strip()
            )

            b = int(
                parts[1].strip()
            )


            valid_a = [
                1, 3, 5, 7, 9,
                11, 15, 17, 19,
                21, 23, 25
            ]


            if a not in valid_a:

                return jsonify({
                    "success": False,
                    "message":
                    "Nilai a harus relatif prima dengan 26."
                })


            ciphertext = affine_encrypt(
                plaintext,
                a,
                b
            )


            return jsonify({
                "success": True,
                "result": ciphertext
            })


        # =================================
        # ALGORITHM BELUM TERSEDIA
        # =================================

        return jsonify({
            "success": False,
            "message":
            "Algoritma ini belum diimplementasikan."
        })


    except ValueError:

        return jsonify({
            "success": False,
            "message":
            "Format key tidak valid."
        })


# =====================================
# TEXT DECRYPTION
# =====================================

@app.route("/decrypt", methods=["POST"])
def decrypt():

    data = request.get_json()

    algorithm = data.get("algorithm")
    ciphertext = data.get("ciphertext")
    key = data.get("key")


    try:

        # =================================
        # SHIFT CIPHER
        # =================================

        if algorithm == "shift":

            key = int(key)

            plaintext = shift_decrypt(
                ciphertext,
                key
            )

            return jsonify({
                "success": True,
                "result": plaintext
            })


        # =================================
        # SUBSTITUTION CIPHER
        # =================================

        if algorithm == "substitution":

            key = key.lower()


            if len(key) != 26:

                return jsonify({
                    "success": False,
                    "message":
                    "Key Substitution harus terdiri dari 26 huruf."
                })


            if not key.isalpha():

                return jsonify({
                    "success": False,
                    "message":
                    "Key hanya boleh berisi huruf."
                })


            if len(set(key)) != 26:

                return jsonify({
                    "success": False,
                    "message":
                    "Setiap huruf pada key harus berbeda."
                })


            plaintext = substitution_decrypt(
                ciphertext,
                key
            )


            return jsonify({
                "success": True,
                "result": plaintext
            })


        # =================================
        # AFFINE CIPHER
        # =================================

        if algorithm == "affine":

            parts = key.split(",")


            if len(parts) != 2:

                return jsonify({
                    "success": False,
                    "message":
                    "Key Affine harus berupa a,b. Contoh: 5,8"
                })


            a = int(
                parts[0].strip()
            )

            b = int(
                parts[1].strip()
            )


            valid_a = [
                1, 3, 5, 7, 9,
                11, 15, 17, 19,
                21, 23, 25
            ]


            if a not in valid_a:

                return jsonify({
                    "success": False,
                    "message":
                    "Nilai a harus relatif prima dengan 26."
                })


            plaintext = affine_decrypt(
                ciphertext,
                a,
                b
            )


            return jsonify({
                "success": True,
                "result": plaintext
            })


        # =================================
        # ALGORITHM BELUM TERSEDIA
        # =================================

        return jsonify({
            "success": False,
            "message":
            "Algoritma ini belum diimplementasikan."
        })


    except ValueError:

        return jsonify({
            "success": False,
            "message":
            "Format key tidak valid."
        })


# =====================================
# FILE ENCRYPTION / DECRYPTION
# =====================================

@app.route("/process-file", methods=["POST"])
def process_file():

    uploaded_file = request.files.get(
        "file"
    )

    algorithm = request.form.get(
        "algorithm"
    )

    key = request.form.get(
        "key"
    )

    mode = request.form.get(
        "mode"
    )


    if uploaded_file is None:

        return jsonify({
            "success": False,
            "message":
            "File belum dipilih."
        }), 400


    if not key:

        return jsonify({
            "success": False,
            "message":
            "Key belum diisi."
        }), 400


    # =================================
    # SHIFT CIPHER FILE
    # =================================

    if algorithm == "shift":

        try:

            shift_key = int(key)

        except ValueError:

            return jsonify({
                "success": False,
                "message":
                "Key Shift Cipher harus berupa angka."
            }), 400


        original_data = (
            uploaded_file.read()
        )


        if mode == "encrypt":

            processed_data = bytes(
                (
                    byte + shift_key
                ) % 256
                for byte in original_data
            )

            filename = (
                "encrypted_"
                + uploaded_file.filename
            )


        elif mode == "decrypt":

            processed_data = bytes(
                (
                    byte - shift_key
                ) % 256
                for byte in original_data
            )

            filename = (
                "decrypted_"
                + uploaded_file.filename
            )


        else:

            return jsonify({
                "success": False,
                "message":
                "Mode tidak valid."
            }), 400


        return send_file(
            io.BytesIO(
                processed_data
            ),
            as_attachment=True,
            download_name=filename,
            mimetype=
            "application/octet-stream"
        )


    # =================================
    # FILE BELUM TERSEDIA
    # =================================

    return jsonify({
        "success": False,
        "message":
        "File encryption untuk algoritma ini belum tersedia."
    }), 400


# =====================================
# MENJALANKAN FLASK
# =====================================

if __name__ == "__main__":

    app.run(
        debug=True
    )