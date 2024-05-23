from django.apps import AppConfig


class UserextensiondbConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'UserExtensionDB'

    def ready(self):
        import UserExtensionDB.signals
