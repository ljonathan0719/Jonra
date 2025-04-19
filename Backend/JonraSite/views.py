import json
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.forms.models import model_to_dict
from django.core.serializers import serialize, deserialize
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
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
    print(request)
    try:
        type = request.method
        if type == "GET":
            return JsonResponse({ 'message': 'Success' }, status=200)
        elif type == "POST":
            print(request.body)
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

            userObj = User.objects.create(username=user, password=passwd, loggedIn=True)
            userObj.cookie = createCookie(user, passwd)
            userObj.save()

            res = JsonResponse({
                'message': 'User created',
                'status': 'Success'
            }, status=201)
            res.set_cookie(
                key="SessionCookie",
                value=userObj.getCookie(),
                max_age=28800,   # session is 8 hrs long until expiration
                secure=True,
                httponly=True
            )

            return res
    except Exception as e:
        print(e)
        return error(request)

def home(request, name):
    try:
        if request.method == "GET":
            user = User.objects.get(username=name)
            boardset = Board.objects.filter(editors=user)
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
            user = User.objects.get(username=name)
            boardset = Board.objects.filter(editors=user)
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

            userObj = User.objects.get(username=user, password=passwd)
            userObj.loggedIn = True
            userObj.cookie = createCookie(user, passwd)
            userObj.save()

            res = JsonResponse({
                'message': 'User logged in',
                'status': 'Success'
            }, status=201)
            res.set_cookie(
                key="SessionCookie",
                value=userObj.getCookie(),
                max_age=28800,   # session is 8 hrs long until expiration
                secure=True,
                httponly=True
            )

            return res
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

def boardCreate(request, name, boardname):
    try:
        if request.method == "POST":
            user = User.objects.get(username=name)
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

def tasks(request, name, id):
    try:
        user = User.objects.get(username=name)
        board = user.getBoards().get(id=id)
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
            taskname = data.get("taskname")
            task = Task.objects.get(name=taskname)
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