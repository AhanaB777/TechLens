from rest_framework import serializers

from .models import CompetencyScore, EvidenceWeightConfig, SelfAssessment, Skill


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ('id', 'name', 'slug', 'category', 'description')


class CompetencyScoreSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)

    class Meta:
        model = CompetencyScore
        fields = (
            'id', 'skill', 'score', 'level', 'confidence',
            'assessment_component', 'project_component',
            'resume_component', 'self_assessment_component',
            'updated_at',
        )
        read_only_fields = fields


class CompetencyExplainSerializer(serializers.Serializer):
    skill = serializers.CharField()
    score = serializers.FloatField()
    level = serializers.CharField()
    confidence = serializers.FloatField()
    breakdown = serializers.DictField()


class SelfAssessmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SelfAssessment
        fields = ('id', 'skill', 'self_rating', 'note', 'created_at')
        read_only_fields = ('id', 'created_at')

    def validate_self_rating(self, value):
        if not 0 <= value <= 100:
            raise serializers.ValidationError('self_rating must be between 0 and 100.')
        return value


class SkillScoreItemSerializer(serializers.Serializer):
    skill = serializers.CharField()
    score = serializers.FloatField()


class CountSerializer(serializers.Serializer):
    count = serializers.IntegerField()


class DashboardSerializer(serializers.Serializer):
    """
    One composed response for the frontend dashboard. Deliberately excludes
    profile_completeness - that belongs to profiles/resumes, not this app.
    """
    competency_score = serializers.FloatField()
    career_readiness = serializers.FloatField(allow_null=True)
    verified = CountSerializer()
    needs_verification = CountSerializer()
    strengths = SkillScoreItemSerializer(many=True)
    areas_to_improve = SkillScoreItemSerializer(many=True)


class EvidenceWeightConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvidenceWeightConfig
        fields = (
            'id', 'name', 'assessment_weight', 'project_weight',
            'resume_weight', 'self_assessment_weight', 'is_active',
        )
