from django.http import JsonResponse
from django.db import connection


def healthz(_request):
    """Lightweight health endpoint.
    - Verifies DB connectivity by running a trivial SELECT 1
    - Returns JSON with status and minimal info
    """
    db_ok = False
    details = {}
    try:
        # Ensure connection and run a simple query
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
            db_ok = True
        details["db_vendor"] = connection.vendor
    except Exception as exc:
        details["db_error"] = str(exc)

    status_code = 200 if db_ok else 503
    return JsonResponse({"ok": db_ok, **details}, status=status_code)
