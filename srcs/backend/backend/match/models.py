from django.db import models

class matchManager(models.Manager):
	def create_match(self, user, guest1, guest2, guest3, winner, date, tournement_id=0):
		if not user:
			raise ValueError("Match must have a host")
		if not guest1:
			raise ValueError("Match must at least have two player")
		if not winner:
			raise ValueError("Match must have a winner")
		if not date:
			raise ValueError("Match must have a date")
		match_obj = self.model(
			user=user,
			guest1=guest1,
			guest2=guest2,
			guest3=guest3,
			winner=winner,
			date=date,
			tournement_id=tournement_id,
		)
		match_obj.save()
		return match_obj
	# def create_tournement_match():

class Match(models.Model):
	user = models.ForeignKey('Userdb.User', on_delete=models.CASCADE, related_name="Primary_Player")
	guest1 = models.CharField(max_length=80)
	guest2 = models.CharField(max_length=80)
	guest3 = models.CharField(max_length=80)
	winner = models.CharField(max_length=80)
	date = models.DateField()
	tournement_id = models.SmallIntegerField()

	objects = matchManager()

	def __str__(self):
		return self.user