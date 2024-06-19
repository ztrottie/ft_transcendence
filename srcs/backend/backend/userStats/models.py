from django.db import models
from Userdb.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.
class userStats(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    win = models.SmallIntegerField(default=0)
    lost = models.SmallIntegerField(default=0)
    goal = models.IntegerField(default=0)

    def __str__(self):
        return self.user
    def get_win(self):
        return self.win
    def get_lost(self):
        return self.lost
    def get_goal(self):
        return self.goal

@receiver(post_save, sender=User)
def create_user_stats(sender, instance, created, **kwargs):
    if created:
        userStats.objects.create(user=instance)