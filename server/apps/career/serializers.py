from django.db import transaction
from rest_framework import serializers

from .models import Career, CareerGoal, CareerSkillRequirement


class CareerSkillRequirementSerializer(serializers.ModelSerializer):
    skill_id = serializers.IntegerField(source='skill.id', read_only=True)
    skill = serializers.CharField(source='skill.name', read_only=True)
    category = serializers.CharField(source='skill.category', read_only=True)

    class Meta:
        model = CareerSkillRequirement
        fields = (
            'id',
            'skill_id',
            'skill',
            'category',
            'importance',
            'target_level',
            'is_required',
        )


class CareerSerializer(serializers.ModelSerializer):
    competencies = CareerSkillRequirementSerializer(
        source='skill_requirements',
        many=True,
        read_only=True,
    )
    domain = serializers.CharField(source='category', read_only=True)

    class Meta:
        model = Career
        fields = (
            'id',
            'name',
            'slug',
            'description',
            'category',
            'domain',
            'competencies',
        )


class CareerGoalSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='career.name', read_only=True)
    domain = serializers.CharField(source='career.category', read_only=True)
    career = CareerSerializer(read_only=True)
    level = serializers.CharField(source='experience_level')
    timeline = serializers.CharField(source='target_timeline')

    class Meta:
        model = CareerGoal
        fields = (
            'id',
            'career',
            'role',
            'domain',
            'level',
            'timeline',
            'is_primary',
            'created_at',
            'updated_at',
        )
        read_only_fields = (
            'id',
            'career',
            'role',
            'domain',
            'is_primary',
            'created_at',
            'updated_at',
        )


class CareerGoalWriteSerializer(serializers.ModelSerializer):
    role = serializers.CharField(write_only=True)
    level = serializers.ChoiceField(
        source='experience_level',
        choices=CareerGoal.EXPERIENCE_LEVELS,
        required=False,
    )
    timeline = serializers.ChoiceField(
        source='target_timeline',
        choices=CareerGoal.TIMELINE_OPTIONS,
        required=False,
    )

    class Meta:
        model = CareerGoal
        fields = ('role', 'level', 'timeline')

    def validate_role(self, value):
        try:
            return Career.objects.get(name__iexact=value, is_active=True)
        except Career.DoesNotExist:
            raise serializers.ValidationError('That career is not available.')

    def validate(self, attrs):
        user = self.context['request'].user
        career = attrs['role']
        instance = self.instance

        duplicate = CareerGoal.objects.filter(user=user, career=career)
        if instance:
            duplicate = duplicate.exclude(pk=instance.pk)
        if duplicate.exists():
            raise serializers.ValidationError({'role': 'That career is already one of your goals.'})

        if not instance and CareerGoal.objects.filter(user=user).count() >= 2:
            raise serializers.ValidationError('You can have up to two career goals.')

        attrs['career'] = career
        attrs.pop('role', None)
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        return CareerGoal.objects.create(user=self.context['request'].user, **validated_data)

    @transaction.atomic
    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
