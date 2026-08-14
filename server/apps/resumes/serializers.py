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
    class Meta:
        model = Resume
        fields = ('file', 'file_name', 'is_primary')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
