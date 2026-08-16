from django.contrib import admin

from .models import Career, CareerGoal, CareerSkillRequirement


class CareerSkillRequirementInline(admin.TabularInline):
    model = CareerSkillRequirement
    extra = 0
    autocomplete_fields = ('skill',)


@admin.register(Career)
class CareerAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'is_active', 'updated_at')
    list_filter = ('category', 'is_active')
    search_fields = ('name', 'slug', 'category')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [CareerSkillRequirementInline]


@admin.register(CareerGoal)
class CareerGoalAdmin(admin.ModelAdmin):
    list_display = ('user', 'career', 'experience_level', 'target_timeline', 'is_primary', 'updated_at')
    list_filter = ('is_primary', 'experience_level', 'target_timeline')
    search_fields = ('user__username', 'user__email', 'career__name')
    autocomplete_fields = ('user', 'career')


@admin.register(CareerSkillRequirement)
class CareerSkillRequirementAdmin(admin.ModelAdmin):
    list_display = ('career', 'skill', 'importance', 'target_level', 'is_required')
    list_filter = ('is_required',)
    search_fields = ('career__name', 'skill__name')
    autocomplete_fields = ('career', 'skill')
