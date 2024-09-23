from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import RelationType
from Userdb.models import StatusType

@receiver(post_migrate)
def add_initial_data(sender, **kwargs):
	if sender.name == 'RelationDB':
		if not RelationType.objects.exists():
			RelationType.objects.create(Description="Friend")
			RelationType.objects.create(Description="Blocked")
		if not StatusType.objects.exists():
			StatusType.objects.create(Description="Online")
			StatusType.objects.create(Description="Offline")
			StatusType.objects.create(Description="In Game")