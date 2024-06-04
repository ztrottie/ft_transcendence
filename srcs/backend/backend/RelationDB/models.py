from django.db import models

class RelationType(models.Model):
	RelationTypeId = models.AutoField(primary_key=True)
	Description = models.CharField(max_length=20, null=True)

	def __str__(self):
		return self.Description

class Relation(models.Model):
	User1Id = models.ForeignKey('Userdb.User', on_delete=models.CASCADE, related_name="Relation_user1")
	User2Id = models.ForeignKey('Userdb.User', on_delete=models.CASCADE, related_name="Relation_user2")
	RelationTypeId = models.ForeignKey(RelationType, on_delete=models.CASCADE)

	def __str__(self):
		return self.RelationTypeId
	def getUser1ID(self):
		return self.User1Id
	def getUser2ID(self):
		return self.User2Id
