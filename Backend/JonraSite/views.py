import json
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.forms.models import model_to_dict
from django.core.serializers import serialize, deserialize
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from django.conf import settings
import random
from models.models import *

# NOTE: for information on Django http req-res attributes / methods
# https://docs.djangoproject.com/en/5.1/ref/request-response/

# NOTE: Django's CSRF cookie security has been disabled for development.
# Please look at: https://www.geeksforgeeks.org/csrf-token-in-django/

# TO-DO: Add auto testing script for req-res 

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
    if request.method != "POST":
        return JsonResponse({"message": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
        username = data.get("user", "").strip()
        password = data.get("password", "").strip()

        if not username or not password:
            return JsonResponse({"message": "Missing one or more fields"}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"message": "User already exists"}, status=400)

        new_user = User(username=username, password=password, loggedIn=True)
        new_user.cookie = createCookie(username, password)
        new_user.save()

        res = JsonResponse({"message": "User created successfully"}, status=201)
        res.set_cookie(
                    key="SessionCookie",
                    value=new_user.getCookie(),
                    max_age=28800,   # session is 8 hrs long until expiration
                    secure=True,
                    httponly=True,
                )

        return res

    except Exception as e:
        return JsonResponse({"message": "Invalid request"}, status=400)

def home(request, name):
    try:
        user = User.objects.get(username=name)
        boardset = Board.objects.filter(editors=user)
        cookie = "" if settings.DEBUG else request.COOKIES.get("SessionCookie")
        if (cookie != user.getCookie() or not user.getIsLoggedIn()) and not settings.DEBUG:
            print(cookie == user.getCookie())
            print(request.COOKIES)
            print(user.getIsLoggedIn())
            return JsonResponse({
                'message': "Unauthorized",
                'status': "Failed"
            }, status=401)
        if request.method == "GET":
            boards = [model_to_dict(board) for board in boardset]
            # boards = [(board.getId(), board.getName()) for board in boardset]
            boards = serialize('json', boardset)
            data = {
                "username": user.getUsername(),
                "boards": boards
            }
            # print(list(deserialize("json", boards)))
            return JsonResponse(data)
        elif request.method == "POST":
            boards = [model_to_dict(board) for board in boardset]

            # boards = [(board.getId(), board.getName()) for board in boardset]
            # boards = serialize('json', boardset)
            data = {
                "username": user.getUsername(),
                "boards": serialize('json', boards),
                "tasks": boards[0].getTasks()
            }
            # print(list(deserialize("json", boards)))
            return JsonResponse(data)
    except Exception as e:
        print(e)
        return error(request)

def login(request):
    if request.method != "POST":
        return JsonResponse({"message": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
        username = data.get("user", "").strip()
        password = data.get("password", "").strip()

        if not username or not password:
            return JsonResponse({"message": "Missing credentials"}, status=400)

        try:
            user = User.objects.get(username=username)
            if user.password == password:
                user.cookie = createCookie(username, password)
                user.loggedIn = True
                user.save()
                res = JsonResponse({"message": "Login successful"}, status=200)
                res.set_cookie(
                    key="SessionCookie",
                    value=user.getCookie(),
                    max_age=28800,   # session is 8 hrs long until expiration
                    secure=True,
                    httponly=True,
                )
                return res
            else:
                return JsonResponse({"message": "Invalid password"}, status=401)

        except User.DoesNotExist:
            return JsonResponse({"message": "User does not exist"}, status=401)

    except Exception as e:
        return JsonResponse({"message": "Invalid request"}, status=400)

def board(request, name):
    try:
        qryName = request.GET.get('board')
        board = Board.objects.get(name=qryName)
        editors = board.getEditors().all()
        user = User.objects.get(username=name)

        cookie = "" if settings.DEBUG else request.COOKIE.get("SessionCookie")
        if (cookie != user.getCookie() or not user.getIsLoggedIn()) and not settings.DEBUG:
            return JsonResponse({
                'message': "Unauthorized",
                'status': "Failed"
            }, status=401)
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

def logout(request, name):  # <-- accept `name`
    try:
        user = User.objects.get(username=name)
        cookie = "" if settings.DEBUG else request.COOKIES.get("SessionCookie")
        if cookie != user.getCookie() and not settings.DEBUG:
            return JsonResponse({
                'message': "Invalid cookie!",
                'status': "Failed"
            }, status=401)
        
        user.cookie = ""
        user.loggedIn = False
        user.save()
        return JsonResponse({"message": f"User {name} logged out successfully"}, status=200)
    except Exception as e:
        return JsonResponse({"message": "Invalid cookie"}, status=401)
    
def boardCreate(request, name, boardname):
    try:
        user = User.objects.get(username=name)
        
        cookie = "" if settings.DEBUG else request.COOKIES.get("SessionCookie")
        if (cookie != user.getCookie() or not user.getIsLoggedIn()) and not settings.DEBUG:
            return JsonResponse({
                'message': "Unauthorized",
                'status': "Failed"
            }, status=401)
        if request.method == "POST":
            newBoard = Board()
            newBoard.name = boardname
            newBoard.save()
            newBoard.editors.add(user)
            data = {
                "username": user.getUsername(),
                "board": serialize('json', [newBoard])
            }
            return JsonResponse(data)
    except Exception as e:
        print(e)
        return error(request, "Board was not created.")

def boardDelete(request, name, id):
    try:
        if request.method == "DELETE":
            user = User.objects.get(username=name)
            board = user.getBoards().get(id=id)
            board.delete()
            return JsonResponse({
                'message': "Board deleted successfully",
                'status': 'Success'
            }, status=201)
    except Exception as e:
        print(e)
        return error(request, "An issue has occurred.")
    

def tasks(request, name, id):
    try:
        user = User.objects.get(username=name)
        board = user.getBoards().get(id=id)

        cookie = "" if settings.DEBUG else request.COOKIES.get("SessionCookie")
        if (cookie != user.getCookie() or not user.getIsLoggedIn()) and not settings.DEBUG:
            return JsonResponse({
                'message': "Unauthorized",
                'status': "Failed"
            }, status=401)
        if request.method == "GET":
            qryTasks = board.getTasks()
            tasks = [task for task in qryTasks]
            return JsonResponse({
                'boardname': board.getName(),
                'tasks': serialize('json', tasks),
                'status': 'Success'
            }, status=200)
        elif request.method == "POST":
            data = json.loads(request.body)
            taskname = data.get("taskName")
            desc = data.get("description")
            priority = data.get("priority")
            taskstatus = data.get("taskStatus")
            
            task = Task.objects.create(
                board=board, 
                name=taskname,
                description=desc,
                priority=priority,
                status=taskstatus
            )
            task.save()
            return JsonResponse({
                'message': "New task made!",
                'status': 'Success'
            }, status=201)
        elif request.method == "DELETE":
            print(request.body)
            data = json.loads(request.body)
            taskId = data.get("taskId")
            task = Task.objects.get(id=taskId)
            task.delete()

            return JsonResponse({
                'message': 'Task removed',
                'status': 'Success'
            }, status=200)
        elif request.method == "PATCH":
            taskId = json.loads(request.body).get("taskId")
            taskName = request.GET.get("taskName") if 'taskName' in request.GET else ""
            taskDesc = request.GET.get("taskDesc") if 'taskDesc' in request.GET else ""
            taskPriority = request.GET.get("taskPriority") if 'taskPriority' in request.GET else ""
            taskStatus = request.GET.get("taskStatus") if 'taskStatus' in request.GET else ""
            print(taskName)
            
            task = Task.objects.get(id=taskId)
            if taskName: task.name = taskName
            if taskDesc: task.description = taskDesc
            if taskPriority: task.priority = taskPriority
            if taskStatus: task.status = taskStatus
            task.save()

            return JsonResponse({
                'message': 'Task edited',
                'status': 'Success'
            }, status=200)
        else:
            return JsonResponse({
                'tasks': serialize('json', []),
                'status': 'Success'
            }, status=200)
    except Exception as e:
        print(e)
        return error(request, "An issue has occurred.")