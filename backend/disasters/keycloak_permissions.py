import time
import jwt
import requests

from django.conf import settings
from rest_framework.permissions import BasePermission

_cached_metadata = None
_cached_metadata_time = 0
_cached_jwk_client = None
_cached_jwk_time = 0

METADATA_TTL = 300   # 5 λεπτά
JWK_TTL = 300        # 5 λεπτά


class KeycloakTokenError(Exception):
    pass


class KeycloakAdminPermission(BasePermission):
    message = "Δεν επιτρέπεται η πρόσβαση. Απαιτείται ρόλος admin."

    def has_permission(self, request, view):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return False

        token = auth_header.replace("Bearer ", "").strip()
        if not token:
            return False

        try:
            payload = self._decode_token(token)
        except Exception as e:
            print("KEYCLOAK PERMISSION ERROR:", str(e))
            return False

        realm_roles = payload.get("realm_access", {}).get("roles", [])
        return "admin" in realm_roles

    def _get_metadata(self):
        global _cached_metadata, _cached_metadata_time

        now = time.time()
        if _cached_metadata and (now - _cached_metadata_time) < METADATA_TTL:
            return _cached_metadata

        well_known_url = (
            f"{settings.KEYCLOAK_BASE_URL}/realms/"
            f"{settings.KEYCLOAK_REALM}/.well-known/openid-configuration"
        )
        metadata_resp = requests.get(well_known_url, timeout=10)
        metadata_resp.raise_for_status()

        _cached_metadata = metadata_resp.json()
        _cached_metadata_time = now
        return _cached_metadata

    def _get_jwk_client(self, jwks_uri):
        global _cached_jwk_client, _cached_jwk_time

        now = time.time()
        if _cached_jwk_client and (now - _cached_jwk_time) < JWK_TTL:
            return _cached_jwk_client

        _cached_jwk_client = jwt.PyJWKClient(jwks_uri)
        _cached_jwk_time = now
        return _cached_jwk_client

    def _decode_token(self, token: str):
        metadata = self._get_metadata()

        issuer = metadata["issuer"]
        jwks_uri = metadata["jwks_uri"]

        jwk_client = self._get_jwk_client(jwks_uri)
        signing_key = jwk_client.get_signing_key_from_jwt(token)

        options = {
            "verify_signature": True,
            "verify_exp": True,
            "verify_aud": False,
            "verify_iss": True,
        }

        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256", "RS384", "RS512"],
            issuer=issuer,
            options=options,
        )
        return payload