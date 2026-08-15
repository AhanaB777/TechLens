from rest_framework import serializers

from .models import AssessmentAttempt, Question, SkillResult


class AttemptQuestionSerializer(serializers.ModelSerializer):
    """Question shown to a student taking the test - correct_answer withheld."""
    skill = serializers.CharField(source='skill.name', read_only=True)

    class Meta:
        model = Question
        fields = ('id', 'skill', 'text', 'question_type', 'options', 'points')


class AttemptDetailSerializer(serializers.ModelSerializer):
    """Returned right after an attempt is built - what the student answers."""
    questions = AttemptQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = AssessmentAttempt
        fields = ('id', 'status', 'overall_score', 'started_at', 'completed_at', 'questions')
        read_only_fields = fields


class SkillResultSerializer(serializers.ModelSerializer):
    skill = serializers.CharField(source='skill.name', read_only=True)

    class Meta:
        model = SkillResult
        fields = ('skill', 'score', 'correct_count', 'total_count')


class AttemptResultSerializer(serializers.ModelSerializer):
    """Returned after submission - per-skill results, matching the
    {attempt_id, results: [{skill, score, correct, total}, ...]} shape."""
    skill_results = SkillResultSerializer(many=True, read_only=True)

    class Meta:
        model = AssessmentAttempt
        fields = ('id', 'status', 'overall_score', 'started_at', 'completed_at', 'skill_results')
        read_only_fields = fields


class AnswerInputSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    answer = serializers.CharField(allow_blank=True)


class SubmitAttemptSerializer(serializers.Serializer):
    answers = AnswerInputSerializer(many=True)


class BuildAttemptSerializer(serializers.Serializer):
    num_skills = serializers.IntegerField(required=False, default=3, min_value=1, max_value=10)
    questions_per_skill = serializers.IntegerField(required=False, default=5, min_value=1, max_value=20)


class SkillCooldownSerializer(serializers.Serializer):
    skill = serializers.CharField()
    last_tested = serializers.DateTimeField()
    in_cooldown = serializers.BooleanField()
    available_at = serializers.DateTimeField()
