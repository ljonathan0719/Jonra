from django.urls import path
from . import views

print("In App urls...")
urlpatterns = [
    path("", views.index)
]