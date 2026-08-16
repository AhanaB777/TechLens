from rest_framework import serializers

from .models import Resume


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = (
            'id',
            'file',
            'file_name',
            'uploaded_at',
            'updated_at',
            'is_primary',
            'extraction_status',
            'extracted_text',
            'extracted_skills',
            'extracted_tech_stack',
            'extracted_experience',
            'extracted_education',
            'extraction_error',
        )
        read_only_fields = (
            'id',
            'uploaded_at',
            'updated_at',
            'extraction_status',
            'extracted_text',
            'extracted_skills',
            'extracted_tech_stack',
            'extracted_experience',
            'extracted_education',
            'extraction_error',
        )


class ResumeUploadSerializer(serializers.ModelSerializer):
    resume = serializers.FileField(write_only=True, required=False, allow_null=True, source='file')
    file = serializers.FileField(write_only=True, required=False, allow_null=True)
    file_name = serializers.CharField(required=False)

    class Meta:
        model = Resume
        fields = ('resume', 'file', 'file_name', 'is_primary')

    def validate(self, attrs):
        # Accept either 'resume' or 'file' as the upload field
        if not attrs.get('file') and self.context['request'].FILES.get('resume'):
            attrs['file'] = self.context['request'].FILES['resume']
        if not attrs.get('file'):
            raise serializers.ValidationError({'file': 'A resume file is required.'})

        value = attrs['file']
        allowed = ('.pdf', '.doc', '.docx', '.txt')
        name = value.name.lower()
        if not name.endswith(allowed):
            raise serializers.ValidationError(
                {'file': f"Unsupported file format. Allowed: {', '.join(allowed)}"}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop('resume', None)
        file_obj = validated_data.get('file')
        if not validated_data.get('file_name'):
            validated_data['file_name'] = getattr(file_obj, 'name', 'resume.pdf')
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
