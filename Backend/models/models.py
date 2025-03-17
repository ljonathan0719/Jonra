from django.db import models
# Create your models here.

'''
User Model
    - Must have password and unique username defined on signup
'''
class User(models.Model):
    username = models.CharField(primary_key=True, max_length=255)
    password = models.CharField(max_length=255)

    def getUsername(self):
        return self.username
    
    def getPassword(self):
        return self.password

'''
Board Model
    - Has name and unique id
    - Can belong to many users and many users can share board (Symmetric relationship)
        - Editors is a current list of Users that is allowed to edit the board
    - Created by a user
'''
class Board(models.Model):
    id = models.AutoField(primary_key=True)
    editors = models.ManyToManyField(User)
    name = models.CharField(max_length=255)

    def getId(self):
        return self.id
    
    def getName(self):
        return self.name

    def getEditors(self):
        return self.editors

'''
Task Model
    - Stores unique id
    - Name: made by user
    - Description: info given by user to describe the task
    - Board: the board this task belongs to
    - Priority: level of importance set by the user
    - Status: current progress of the task updated by the user
'''
class Task(models.Model):
    id = models.AutoField(primary_key=True)
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=3000)
    priority = models.CharField(max_length=255, default="None")
    status = models.CharField(max_length=255, default="None")

    def getId(self):
        return self.id
    
    def getName(self):
        return self.name

    def getDes(self):
        return self.description

    def getBoard(self):
        return self.board
    
    def getPriority(self):
        return self.priority

    def getStatus(self):
        return self.status
