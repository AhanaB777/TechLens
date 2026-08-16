from django.db import transaction

from .models import CareerGoal


def get_primary_career_goal(user):
    return (
        CareerGoal.objects
        .filter(user=user, is_primary=True)
        .select_related('career')
        .first()
    ) or (
        CareerGoal.objects
        .filter(user=user)
        .select_related('career')
        .first()
    )


@transaction.atomic
def set_primary_career_goal(user, goal):
    if goal.user_id != user.id:
        raise ValueError('Career goal does not belong to this user.')

    CareerGoal.objects.filter(user=user).exclude(pk=goal.pk).update(is_primary=False)
    if not goal.is_primary:
        goal.is_primary = True
        goal.save(update_fields=['is_primary', 'updated_at'])
    return goal
