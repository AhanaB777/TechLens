from django.urls import reverse
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.competencies.models import Skill
from apps.career.models import Career, CareerGoal, CareerSkillRequirement


class CareerApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='career-test',
            email='career@example.com',
            password='StrongPass123!',
        )
        self.client.force_authenticate(self.user)

        python = Skill.objects.create(name='Python', slug='python', category='Programming')
        career = Career.objects.create(
            name='Backend Developer',
            slug='backend-developer',
            category='Software Development',
        )
        CareerSkillRequirement.objects.create(
            career=career,
            skill=python,
            importance=1.0,
            target_level=80,
            is_required=True,
        )
        self.career = career

    def test_list_careers_returns_requirements(self):
        response = self.client.get('/api/career/roles/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['name'], 'Backend Developer')
        self.assertEqual(response.data[0]['competencies'][0]['skill'], 'Python')

    def test_create_goal_sets_first_goal_primary(self):
        response = self.client.post('/api/career/goals/', {
            'role': 'Backend Developer',
            'level': 'Entry Level',
            'timeline': '6 months',
        }, format='json')

        self.assertEqual(response.status_code, 201)
        goal = CareerGoal.objects.get(user=self.user)
        self.assertTrue(goal.is_primary)
        self.assertEqual(response.data['role'], 'Backend Developer')

    def test_user_can_have_at_most_two_goals(self):
        second = Career.objects.create(
            name='Frontend Developer',
            slug='frontend-developer',
            category='Software Development',
        )
        third = Career.objects.create(
            name='Data Analyst',
            slug='data-analyst',
            category='Data & Analytics',
        )

        for career in (self.career, second):
            response = self.client.post('/api/career/goals/', {'role': career.name}, format='json')
            self.assertEqual(response.status_code, 201)

        response = self.client.post('/api/career/goals/', {'role': third.name}, format='json')
        self.assertEqual(response.status_code, 400)

    def test_activate_goal_changes_primary(self):
        second = Career.objects.create(
            name='Frontend Developer',
            slug='frontend-developer',
            category='Software Development',
        )
        first_goal = CareerGoal.objects.create(user=self.user, career=self.career, is_primary=True)
        second_goal = CareerGoal.objects.create(user=self.user, career=second, is_primary=False)

        response = self.client.post(f'/api/career/goals/{second_goal.id}/activate/')
        self.assertEqual(response.status_code, 200)

        first_goal.refresh_from_db()
        second_goal.refresh_from_db()
        self.assertFalse(first_goal.is_primary)
        self.assertTrue(second_goal.is_primary)
