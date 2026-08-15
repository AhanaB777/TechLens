from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterUserView, send_otp, verify_otp_and_register # <-- added 2 imports

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ========== OTP ROUTES - ADDED BELOW ==========
    path('send-otp/', send_otp, name='send-otp'),
    path('verify-otp-and-register/', verify_otp_and_register, name='verify-otp-and-register'), # <-- FIXED NAME
]