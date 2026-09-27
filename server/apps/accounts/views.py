from django.contrib.auth import get_user_model
from rest_framework import generics, permissions
from.serializers import UserRegistrationSerializer, UserSerializer

User = get_user_model()


class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# ============ OTP CODE STARTS HERE ============
import random
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, permissions
from django.core.mail import send_mail
from django.conf import settings
from.models import OTP
import logging

logger = logging.getLogger(__name__)

def generate_otp():
    return str(random.randint(100000, 999999))


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def send_otp(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email required'}, status=status.HTTP_400_BAD_REQUEST)

    otp_code = generate_otp()
    OTP.objects.update_or_create(email=email, defaults={'otp': otp_code})

    try:
        send_mail(
            'TechLens Verification OTP',
            f'Your verification code for TechLens is: {otp_code}. It expires in 5 minutes.',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
    except Exception as e:
        return Response({'error': f'Failed to send email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'message': f'OTP sent successfully to {email}'})


@api_view(['POST'])
@permission_classes([permissions.AllowAny]) # <-- FIX 3: ADDED THIS LINE
def verify_otp_and_register(request):
    email = request.data.get('email')
    password = request.data.get('password')
    name = request.data.get('name', '')
    otp_input = request.data.get('otp')

    if not all([email, password, otp_input]):
        return Response({'error': 'email, password, otp required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        otp_obj = OTP.objects.get(email=email)
    except OTP.DoesNotExist:
        return Response({'error': 'OTP not found. Send OTP first'}, status=status.HTTP_400_BAD_REQUEST)

    if not otp_obj.is_valid():
        otp_obj.delete()
        return Response({'error': 'OTP expired'}, status=status.HTTP_400_BAD_REQUEST)

    if otp_obj.otp!= otp_input:
        return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)

    User.objects.create_user(email=email, password=password, name=name)
    otp_obj.delete()

    return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)