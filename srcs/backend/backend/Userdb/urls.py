from django.urls import path
from .views import user_list, user_details, user_login, user_details_name
from RelationDB.views import userAddFriend, userRelation
from userStats.views import goal
urlpatterns = [
	path('user_list/', user_list, name="User-List"),
	path('user_details/<int:pk>/', user_details, name="User-Details"),
	path('user_details/<str:name>/', user_details_name, name="User-Details"),
	path('user_login/', user_login, name="User-Is-Login"),
	path('user_relation/<int:pk>/', userRelation, name="User-Relation"),
	path('add_friend/<str:name1>/<str:name2>/', userAddFriend, name="User-add-friend"),
	path('user_goal/<int:pk>/', goal, name="User-Goal"),
]
