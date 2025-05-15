"""
URL configuration for JonraSite project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from . import views


'''
Routes to website:
/login - takes user to login page
/signup - if user has no account, user creates one here
/home/<str:name> - user's home page (could include user id for simplicity)
/home/<str:name>/board/<int:id> - page to examine one of the user's boards
home/<str:name>/board/<int:id>/edit - route to edit tasks (Might not be used)
home/<str:name>/createboard/<str:boardname> - route to create new board
home/<str:name>/deleteboard/<int:id> - route to delete existing board
/logout/<str:name> - not necessarily a page but a route to logout the user from the session
'''
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.login),
    path('login/', views.login),
    path('signup/', views.signup),
    path('home/<str:name>', views.home),
    path('home/<str:name>/board/<int:id>', views.tasks),
    path('home/<str:name>/board/<int:id>/edit', views.tasks),
    path('home/<str:name>/createboard/<str:boardname>', views.boardCreate),
    path('home/<str:name>/deleteboard/<int:id>', views.boardDelete),
    path('logout/<str:name>', views.logout),
]