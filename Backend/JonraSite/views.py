import json
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.forms.models import model_to_dict
from django.core.serializers import serialize
from django.contrib import auth
from django.contrib.auth.hashers import make_password
from django.conf import settings
from models.models import *
import random

# NOTE: for information on Django http req-res attributes / methods
# https://docs.djangoproject.com/en/5.1/ref/request-response/

# NOTE: Django's CSRF cookie security has been disabled for development.
# Please look at: https://www.geeksforgeeks.org/csrf-token-in-django/

def createCookie(username, password):
    hashedPass = make_password(password)
    hasedUser = make_password(username)
    return str(hasedUser) + str(random.randint(100000,999999999)) + hashedPass + str(random.randint(10000,999999999))

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
            
            
            b = User(username=user, password=passwd, loggedIn=True)
            newCookie = createCookie(user, passwd)
            b.cookie = newCookie
            b.save()

            res = JsonResponse({
                'message': 'Created account',
                'status': 'Success'
            }, status=201)
            res.set_cookie(
                key="SessionCookie", 
                value=b.cookie,
                max_age=28800, # Session is 8 hrs long
                secure=True,
                httponly=True
            )
            return res
            
    except Exception as e:
        print(e)
        return error(request)

def home(request, name):
    try:
        user = User.objects.get(username=name)
        print(request)
        cookie = request.COOKIES["SessionCookie"]
        if cookie != user.getCookie() and not settings.DEBUG:
            return JsonResponse({
                        'message': 'Unauthorized',
                        'status': 'Failed'
                    }, status=401)
        
        if request.method == "GET":
            boardset = Board.objects.filter(editors=user)
            boards = [model_to_dict(board) for board in boardset]
            boards = serialize('json', boardset)
            data = {
                "username": user.getUsername(),
                "boards": boards
            }
            return JsonResponse(data)
        elif request.method == "POST":
            boardset = Board.objects.filter(editors=user)
            boards = [model_to_dict(board) for board in boardset]
            data = {
                "username": user.getUsername(),
                "boards": serialize('json', boards),
                "tasks": boards[0].getTasks()
            }
            return JsonResponse(data)
    except Exception as e:
        print(e)
        return error(request)

def login(request):
    try:
        type = request.method
        if type == "GET":
            return JsonResponse({
                'message': 'Welcome',
                'status': 'Success'
            }, status=200)
        elif type == "POST":
            data = json.loads(request.body)
            username = data.get("user")
            passwd = data.get("password")

            if not username or not passwd:
                return JsonResponse({
                    'message': 'Missing one or more fields',
                    'status': 'Failed'
                }, status=400)
            
            user = User.objects.get(username=username, password=passwd)

            if user == User.DoesNotExist:
                return JsonResponse({
                    'message': 'User does not exist!',
                    'status': 'Failure'
                }, status=400)
            
            user.loggedIn = True
            user.cookie = createCookie(user.getUsername(), user.getPassword())
            user.save()
            res = JsonResponse({
                'message': 'Logged In',
                'status': 'Success'
            }, status=200)
            res.set_cookie(
                key="SessionCookie", 
                value=user.cookie, 
                max_age=28800, # Session is 8 hrs long
                secure=True,
                httponly=True
            )
            return res
    except Exception as e:
        print(e)
        return error(request)
        

def board(request, name):
    try:
        qryName = request.GET.get('board')
        board = Board.objects.get(name=qryName)
        editors = board.getEditors().all()
        user = User.objects.get(username=name)

        cookie = request.COOKIES["SessionCookie"]
        if cookie != user.getCookie() and not settings.DEBUG:
            return JsonResponse({
                        'message': 'Unauthorized',
                        'status': 'Failed'
                    }, status=401)
        
        if user not in editors:
            return JsonResponse({
                    'message': 'User not editor of this board.',
                    'status': 'Failed'
            }, status=400)
        
        data = {
            'Tasks': serialize('json', board.getTasks()),
            'Users': serialize('json', [user]),
        }
        return JsonResponse(data, status=200)
    except Exception as e:
        print(e)
        return error(request, "Board does not exist.")

def logout(request, name):
    try:
        user = User.objects.get(username=name)
        cookie = request.COOKIES["SessionCookie"]

        if cookie != user.getCookie() and not settings.DEBUG:
            return JsonResponse({
                        'message': 'Unauthorized',
                        'status': 'Failed'
                    }, status=401)
        
        user.loggedIn = False
        user.cookie = ''
        user.save()
        return JsonResponse({
            'message': 'Logged out',
            'status': 'Success'
        }, status=200)
    except Exception as e:
        print(e)
        return error(request, "User does not exist.")