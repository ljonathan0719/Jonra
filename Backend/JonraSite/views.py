import json
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.core.serializers import serialize, deserialize
from models.models import *

# NOTE: for information on Django http req-res attributes / methods
# https://docs.djangoproject.com/en/5.1/ref/request-response/

# NOTE: Django's CSRF cookie security has been disabled for development.
# Please look at: https://www.geeksforgeeks.org/csrf-token-in-django/

# TO-DO: Add auto testing script for req-res 

def error(request, msg="Something went wrong..."):
    res = {
        'message': msg,
        'status': "Error",
    }
    return JsonResponse(res, status=404)

def signup(request):
    print(request)
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
            
            userExist = User.objects.filter(username=user).count()
            if userExist > 0:
                return JsonResponse({
                    'message': 'User already exists',
                    'status': 'Failed'
                }, status=400)

            b = User(username=user, password=passwd)
            b.save()

            return JsonResponse({
                'status': 'Success'
            }, status=201)
    except Exception as e:
        print(e)
        return error(request)

def home(request, name):
    print(name)
    user = User.objects.get(username=name)
    boardset = Board.objects.filter(editors=user)
    # boards = [model_to_dict(board) for board in boardset]
    boards = serialize('json', boardset)
    data = {
        "Username": user.getUsername(),
        "Available Boards": boards
    }
    # print(list(deserialize("json", boards)))
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

def board(request, name):
    try:
        qryName = request.GET.get('board')
        board = Board.objects.get(name=qryName)
        editors = board.getEditors().all()
        user = User.objects.get(username=name)
        if user not in editors:
            return JsonResponse({
                    'message': 'User not editor of this board.',
                    'status': 'Failed'
            }, status=400)
        
        data = {
            'Board': serialize('json', [board]),
            'Users': serialize('json', [user]),
        }
        return JsonResponse(data, status=200)
    except Exception as e:
        print(e)
        return error(request, "Board does not exist.")

def logout(request):
    return HttpResponse("Logout page")