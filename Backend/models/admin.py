from django.contrib import admin

# Register your models here.
from .models import User, Task, Board

admin.site.register(User)
admin.site.register(Task)
admin.site.register(Board)