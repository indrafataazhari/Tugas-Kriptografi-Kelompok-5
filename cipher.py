# =====================================
# SHIFT CIPHER
# =====================================

def shift_encrypt(text, key):

    result = ""

    for char in text:

        if char.isalpha():

            base = (
                ord('A')
                if char.isupper()
                else ord('a')
            )

            result += chr(
                (
                    ord(char)
                    - base
                    + key
                ) % 26 + base
            )

        else:

            result += char

    return result


def shift_decrypt(text, key):

    return shift_encrypt(
        text,
        -key
    )


# =====================================
# SUBSTITUTION CIPHER
# =====================================

def substitution_encrypt(text, key):

    alphabet = "abcdefghijklmnopqrstuvwxyz"

    key = key.lower()

    result = ""

    for char in text:

        if char.isalpha():

            index = alphabet.index(
                char.lower()
            )

            if char.isupper():

                result += key[index].upper()

            else:

                result += key[index]

        else:

            result += char

    return result


def substitution_decrypt(text, key):

    alphabet = "abcdefghijklmnopqrstuvwxyz"

    key = key.lower()

    result = ""

    for char in text:

        if char.isalpha():

            index = key.index(
                char.lower()
            )

            if char.isupper():

                result += alphabet[index].upper()

            else:

                result += alphabet[index]

        else:

            result += char

    return result


# =====================================
# AFFINE CIPHER
# =====================================

def affine_encrypt(text, a, b):

    result = ""

    for char in text:

        if char.isalpha():

            base = (
                ord('A')
                if char.isupper()
                else ord('a')
            )

            x = ord(char) - base

            encrypted = (
                a * x + b
            ) % 26

            result += chr(
                encrypted + base
            )

        else:

            result += char

    return result


def mod_inverse(a, m):

    for x in range(1, m):

        if (a * x) % m == 1:

            return x

    return None


def affine_decrypt(text, a, b):

    a_inverse = mod_inverse(
        a,
        26
    )

    if a_inverse is None:

        raise ValueError(
            "Nilai a tidak memiliki invers modulo 26."
        )

    result = ""

    for char in text:

        if char.isalpha():

            base = (
                ord('A')
                if char.isupper()
                else ord('a')
            )

            y = ord(char) - base

            decrypted = (
                a_inverse
                * (y - b)
            ) % 26

            result += chr(
                decrypted + base
            )

        else:

            result += char

    return result