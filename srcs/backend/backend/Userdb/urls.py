from django.urls import path
from .views import user_list, user_details, UserListCreate
urlpatterns = [
	path('test/', UserListCreate.as_view(), name='user-list-create'),
	path('user_list/', user_list, name="User-List"),
	path('user_details/<int:pk>/', user_details, name="User-Details"),
]
