from django.shortcuts import render
from django.http import HttpResponse

def signup(request):
    return HttpResponse("Signup page")

def home(request):
    return HttpResponse("Home page")

def login(request):
    return HttpResponse("Login page")

def board(request, id):
    return HttpResponse("Board page with id: " + id)

def logout(request):
    return HttpResponse("Logout page")