import re

import bcrypt

PASSWORD_MIN_LENGTH = 12
PASSWORD_MAX_BYTES = 72
PASSWORD_PATTERN = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$")


def hash_password(password: str) -> str:
    validate_password_strength(password)
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds=12)).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    if len(password.encode("utf-8")) > PASSWORD_MAX_BYTES:
        return False

    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def validate_password_strength(password: str) -> None:
    if len(password) < PASSWORD_MIN_LENGTH:
        raise ValueError("Password must be at least 12 characters long")

    if len(password.encode("utf-8")) > PASSWORD_MAX_BYTES:
        raise ValueError("Password must be 72 bytes or fewer")

    if not PASSWORD_PATTERN.match(password):
        raise ValueError(
            "Password must include uppercase, lowercase, number, and special character"
        )
