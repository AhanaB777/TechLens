from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from.models import User

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('email', 'name', 'is_staff', 'is_active') # no username
    list_filter = ('is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('name',)}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ('email', 'name')
    ordering = ('email',) # <-- changed from username to email

admin.site.register(User, CustomUserAdmin)