"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),

    # Accounts
    path('api/accounts/', include('apps.accounts.urls')),

    # Career
    path('api/career/', include('apps.career.urls')),

    # Competencies
    path('api/competencies/', include('apps.competencies.urls')),

    # Profile
    path('api/profiles/', include('apps.profiles.urls')),

    # Resume
    path('api/resumes/', include('apps.resumes.urls')),

    # Assessment
    path('api/assessments/', include('apps.assessments.urls')),
    
    # Progress  <- ADD THIS ONE LINE
    path('api/progress/', include('apps.progress.urls')),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
