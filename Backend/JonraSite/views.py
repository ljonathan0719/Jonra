import json
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from models.models import *

# NOTE: for information on Django http req-res attributes / methods
# https://docs.djangoproject.com/en/5.1/ref/request-response/

# NOTE: Django's CSRF cookie security has been disabled for development.
# Please look at: https://www.geeksforgeeks.org/csrf-token-in-django/

# TO-DO: Add auto testing script for req-res 

def error(request):
    res = {
        'message': "Something went wrong...",
        'status': "Error",
    }
    return JsonResponse(res, status=404)

def signup(request):
    try:
        type = request.method
        if type == "GET":
            return JsonResponse({ 'message': 'Success' }, status=200)
        elif type == "POST":
            data = json.loads(request.body)
            user = data.get("user")
            passwd = data.get("password")

            if not user or not passwd:
                return JsonResponse({
                    'message': 'Missing one or more fields',
                    'status': 'Failed'
                }, status=400)

            b = User(username=user, password=passwd)
            b.save()

            return JsonResponse({
                'status': 'Success'
            }, status=201)
    except:
        return error(request)

def home(request, name):
    print(name)
    user = User.objects.get(username=name)
    boardset = Board.objects.filter(editors=user)
    boards = [board.getName() for board in boardset]
    data = {"Username": user.getUsername(),
            "Available boards": json.dumps(boards)}
    return JsonResponse(data)

def login(request):
    try:
        type = request.method
        if type == "GET":
            return error(request)
        elif type == "POST":
            data = json.loads(request.body)
            user = data.get("user")
            passwd = data.get("password")

            if not user or not passwd:
                return JsonResponse({
                    'message': 'Missing one or more fields',
                    'status': 'Failed'
                }, status=400)

            if User.objects.get(username=user, password=passwd) != User.DoesNotExist:
                return JsonResponse({
                    'status': 'Success'
                }, status=200)
    except:
        return JsonResponse({
            'message': 'User does not exist!',
            'status': 'Failure'
        }, status=400)

def board(request, id):
    return HttpResponse("Board page with id: " + id)

def logout(request):
    return HttpResponse("Logout page")