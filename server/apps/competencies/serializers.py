from rest_framework import serializers

from .models import CompetencyScore, CompetencyScoreHistory, EvidenceWeightConfig, SelfAssessment, Skill


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ('id', 'name', 'slug', 'category', 'description')


class CompetencyScoreSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)
    evidence_counts = serializers.SerializerMethodField()

    class Meta:
        model = CompetencyScore
        fields = (
            'id', 'skill', 'score', 'level', 'confidence',
            'assessment_component', 'project_component',
            'resume_component', 'self_assessment_component',
            'evidence_counts', 'updated_at',
        )
        read_only_fields = fields

    def get_evidence_counts(self, obj):
        from django.db.models import Count
        from .models import EvidenceRecord

        rows = (
            EvidenceRecord.objects
            .filter(user=obj.user, skill=obj.skill)
            .values('source_type')
            .annotate(count=Count('id'))
        )
        counts = {row['source_type']: row['count'] for row in rows}
        return {
            'assessments': counts.get(EvidenceRecord.SOURCE_ASSESSMENT, 0),
            'projects': counts.get(EvidenceRecord.SOURCE_PROJECT, 0),
            'resume': counts.get(EvidenceRecord.SOURCE_RESUME, 0),
            'self_assessment': counts.get(EvidenceRecord.SOURCE_SELF, 0),
        }


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


class CompetencyScoreHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CompetencyScoreHistory
        fields = ('score', 'confidence', 'recorded_at')


class EvidenceWeightConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvidenceWeightConfig
        fields = (
            'id', 'name', 'assessment_weight', 'project_weight',
            'resume_weight', 'self_assessment_weight', 'is_active',
        )
