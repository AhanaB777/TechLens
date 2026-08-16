from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('competencies', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Career',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150, unique=True)),
                ('slug', models.SlugField(max_length=170, unique=True)),
                ('description', models.TextField(blank=True, default='')),
                ('category', models.CharField(blank=True, default='', max_length=100)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={'ordering': ['name']},
        ),
        migrations.CreateModel(
            name='CareerGoal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('experience_level', models.CharField(choices=[('Entry Level', 'Entry Level'), ('Early Career', 'Early Career'), ('Mid Level', 'Mid Level'), ('Senior Level', 'Senior Level')], default='Entry Level', max_length=30)),
                ('target_timeline', models.CharField(choices=[('3 months', '3 months'), ('6 months', '6 months'), ('9 months', '9 months'), ('12 months', '12 months')], default='6 months', max_length=20)),
                ('is_primary', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('career', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='user_goals', to='career.career')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='career_goals', to=settings.AUTH_USER_MODEL)),
            ],
            options={'ordering': ['-is_primary', '-updated_at']},
        ),
        migrations.CreateModel(
            name='CareerSkillRequirement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('importance', models.FloatField(default=0.5)),
                ('target_level', models.FloatField(default=70)),
                ('is_required', models.BooleanField(default=False)),
                ('career', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='skill_requirements', to='career.career')),
                ('skill', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='career_requirements', to='competencies.skill')),
            ],
            options={'ordering': ['-is_required', '-importance', 'skill__name']},
        ),
        migrations.AddConstraint(
            model_name='careergoal',
            constraint=models.UniqueConstraint(fields=('user', 'career'), name='unique_user_career_goal'),
        ),
        migrations.AddConstraint(
            model_name='careerskillrequirement',
            constraint=models.UniqueConstraint(fields=('career', 'skill'), name='unique_career_skill_requirement'),
        ),
    ]
