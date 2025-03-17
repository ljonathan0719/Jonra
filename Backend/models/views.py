from django.http import HttpResponse
from django.template import loader

from .models import Board


def home(request):
    template = loader.get_template("models/homepage.html")
    return HttpResponse(template.render())
