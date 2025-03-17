from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

def signup(request):
    return HttpResponse("Signup page")

def home(request):
    template = loader.get_template("models/homepage.html")
    return HttpResponse(template.render())

def login(request):
    return HttpResponse("Login page")

def board(request, id):
    return HttpResponse("Board page with id: " + id)

def logout(request):
    return HttpResponse("Logout page")