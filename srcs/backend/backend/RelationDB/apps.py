from django.apps import AppConfig


class RelationDBConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'RelationDB'

    def ready(self):
        import RelationDB.signals
