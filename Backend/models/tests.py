from django.test import TestCase, Client
from models.models import User, Task, Board

# Create your tests here.
class UserTestCase(TestCase):
    def setUp(self):
        User.objects.create(username="Andrei", password="123")
        User.objects.create(username="Andrei clone", password="JS is good")
        User.objects.create(username="Johnny", password="9u42hpnf92hbq@fho")
    
    def testUsername(self):
        and1_user = User.objects.get(username="Andrei")
        and2_user = User.objects.get(username="Andrei clone")
        jon_user = User.objects.get(username="Johnny")

        self.assertEqual(and1_user.getUsername(), "Andrei")
        self.assertEqual(and2_user.getUsername(), "Andrei clone")
        self.assertEqual(jon_user.getUsername(), "Johnny")            
    
    def testPassword(self):
        and1_user = User.objects.get(username="Andrei")
        and2_user = User.objects.get(username="Andrei clone")
        jon_user = User.objects.get(username="Johnny")

        self.assertEqual(and1_user.getPassword(), "123")        
        self.assertEqual(and2_user.getPassword(), "JS is good")        
        self.assertEqual(jon_user.getPassword(), "9u42hpnf92hbq@fho")


class TaskTestCase(UserTestCase):
    def setUp(self):
        super().setUp()
        Task.objects.create(
            name="Create frontend", 
            description="Do it now", 
            priority="High", 
            status="Incomplete"
            )
        Task.objects.create(name="Do backend", description="None")
        Task.objects.create(name="Make tests", description="Follow title", status="Done")
