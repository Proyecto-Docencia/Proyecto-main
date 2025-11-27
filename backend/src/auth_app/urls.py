from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),
    path('password-recovery/', views.password_recovery_view, name='password_recovery'),
    path('profile/', views.profile_view, name='profile'),
    path('csrf/', views.get_csrf_token, name='csrf_token'),
]