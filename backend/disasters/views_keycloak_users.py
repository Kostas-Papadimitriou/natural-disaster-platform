from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .keycloak_admin import (
    list_users,
    create_user,
    delete_user,
    list_groups,
    assign_user_to_group,
    remove_user_from_group,
)
from .keycloak_permissions import KeycloakAdminPermission


class KeycloakUsersView(APIView):
    permission_classes = [KeycloakAdminPermission]

    def get(self, request):
        try:
            users = list_users()
            return Response(users, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"message": f"Σφάλμα ανάκτησης χρηστών: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request):
        try:
            username = request.data.get("username", "").strip()
            email = request.data.get("email", "").strip()
            first_name = request.data.get("first_name", "").strip()
            last_name = request.data.get("last_name", "").strip()
            password = request.data.get("password", "").strip()
            group_id = request.data.get("group_id", "").strip()

            if not username or not password:
                return Response(
                    {"message": "Τα πεδία username και password είναι υποχρεωτικά."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user_id = create_user(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name,
                password=password,
            )

            if group_id:
                assign_user_to_group(user_id, group_id)

            return Response(
                {"message": "Ο χρήστης δημιουργήθηκε επιτυχώς.", "user_id": user_id},
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            return Response(
                {"message": f"Σφάλμα δημιουργίας χρήστη: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class KeycloakUserDeleteView(APIView):
    permission_classes = [KeycloakAdminPermission]

    def delete(self, request, user_id):
        try:
            delete_user(user_id)
            return Response(
                {"message": "Ο χρήστης διαγράφηκε επιτυχώς."},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"message": f"Σφάλμα διαγραφής χρήστη: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class KeycloakGroupsView(APIView):
    permission_classes = [KeycloakAdminPermission]

    def get(self, request):
        try:
            groups = list_groups()
            return Response(groups, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"message": f"Σφάλμα ανάκτησης groups: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class AssignUserGroupView(APIView):
    permission_classes = [KeycloakAdminPermission]

    def post(self, request, user_id):
        try:
            group_id = request.data.get("group_id", "").strip()
            if not group_id:
                return Response(
                    {"message": "Το group_id είναι υποχρεωτικό."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            assign_user_to_group(user_id, group_id)

            return Response(
                {"message": "Ο χρήστης προστέθηκε στο group επιτυχώς."},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"message": f"Σφάλμα ανάθεσης group: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class RemoveUserGroupView(APIView):
    permission_classes = [KeycloakAdminPermission]

    def post(self, request, user_id):
        try:
            group_id = request.data.get("group_id", "").strip()
            if not group_id:
                return Response(
                    {"message": "Το group_id είναι υποχρεωτικό."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            remove_user_from_group(user_id, group_id)

            return Response(
                {"message": "Ο χρήστης αφαιρέθηκε από το group επιτυχώς."},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"message": f"Σφάλμα αφαίρεσης group: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )