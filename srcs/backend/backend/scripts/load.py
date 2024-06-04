import os
from Userdb.models import User

def run():
	User.objects.all().delete()
	User.objects.create(Name="tamere", Email="tamere.com", Password="tonpere", Login42="rapelcha", Avatar="photoQuelquonque", Name_in_tournement="croutonnet")