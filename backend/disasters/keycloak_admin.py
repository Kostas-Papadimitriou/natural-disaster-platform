import time
import requests
from django.conf import settings

_cached_admin_token = None
_cached_admin_token_exp = 0


def _admin_token_url():
    return (
        f"{settings.KEYCLOAK_BASE_URL}/realms/"
        f"{settings.KEYCLOAK_ADMIN_REALM}/protocol/openid-connect/token"
    )


def _admin_api_base():
    return f"{settings.KEYCLOAK_BASE_URL}/admin/realms/{settings.KEYCLOAK_REALM}"


def get_admin_token() -> str:
    global _cached_admin_token, _cached_admin_token_exp

    now = time.time()

    if _cached_admin_token and now < (_cached_admin_token_exp - 30):
        return _cached_admin_token

    data = {
        "grant_type": "password",
        "client_id": settings.KEYCLOAK_ADMIN_CLIENT_ID,
        "username": settings.KEYCLOAK_ADMIN_USERNAME,
        "password": settings.KEYCLOAK_ADMIN_PASSWORD,
    }

    response = requests.post(_admin_token_url(), data=data, timeout=20)
    response.raise_for_status()
    token_data = response.json()

    _cached_admin_token = token_data["access_token"]
    expires_in = token_data.get("expires_in", 60)
    _cached_admin_token_exp = now + expires_in

    return _cached_admin_token


def get_auth_headers():
    token = get_admin_token()
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }


def list_users():
    headers = get_auth_headers()
    base = _admin_api_base()

    users_url = f"{base}/users"
    response = requests.get(users_url, headers=headers, timeout=20)
    response.raise_for_status()
    users = response.json()

    enriched_users = []

    for user in users:
        user_id = user["id"]
        groups_url = f"{base}/users/{user_id}/groups"
        groups_resp = requests.get(groups_url, headers=headers, timeout=20)
        groups_resp.raise_for_status()
        groups = groups_resp.json()

        enriched_users.append({
            "id": user.get("id"),
            "username": user.get("username"),
            "email": user.get("email"),
            "firstName": user.get("firstName"),
            "lastName": user.get("lastName"),
            "enabled": user.get("enabled"),
            "emailVerified": user.get("emailVerified"),
            "groups": [{"id": g.get("id"), "name": g.get("name")} for g in groups],
        })

    return enriched_users


def create_user(username, email, first_name, last_name, password, enabled=True):
    headers = get_auth_headers()
    base = _admin_api_base()
    url = f"{base}/users"

    payload = {
        "username": username,
        "email": email,
        "firstName": first_name,
        "lastName": last_name,
        "enabled": enabled,
    }

    response = requests.post(url, headers=headers, json=payload, timeout=20)

    if response.status_code == 409:
        raise Exception("Υπάρχει ήδη χρήστης με το ίδιο username ή email.")

    response.raise_for_status()

    location = response.headers.get("Location")
    if not location:
        raise Exception("Ο χρήστης δημιουργήθηκε αλλά δεν επιστράφηκε Location header.")

    user_id = location.rstrip("/").split("/")[-1]

    reset_url = f"{base}/users/{user_id}/reset-password"
    reset_payload = {
        "type": "password",
        "temporary": False,
        "value": password,
    }

    reset_resp = requests.put(
        reset_url,
        headers=headers,
        json=reset_payload,
        timeout=20,
    )
    reset_resp.raise_for_status()

    return user_id


def delete_user(user_id):
    headers = get_auth_headers()
    url = f"{_admin_api_base()}/users/{user_id}"
    response = requests.delete(url, headers=headers, timeout=20)
    response.raise_for_status()


def list_groups():
    headers = get_auth_headers()
    url = f"{_admin_api_base()}/groups"
    response = requests.get(url, headers=headers, timeout=20)
    response.raise_for_status()
    groups = response.json()

    return [{"id": g.get("id"), "name": g.get("name")} for g in groups]


def assign_user_to_group(user_id, group_id):
    headers = get_auth_headers()
    url = f"{_admin_api_base()}/users/{user_id}/groups/{group_id}"
    response = requests.put(url, headers=headers, timeout=20)
    response.raise_for_status()


def remove_user_from_group(user_id, group_id):
    headers = get_auth_headers()
    url = f"{_admin_api_base()}/users/{user_id}/groups/{group_id}"
    response = requests.delete(url, headers=headers, timeout=20)
    response.raise_for_status()