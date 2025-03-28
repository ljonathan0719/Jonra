from django.test import TestCase
from models.models import User, Task, Board

# Create your tests here.
class UserTestCase(TestCase):
    def setUp(self):
        User.objects.create(username="Andrei", password="123")
    
    def testUsername(self):
        print("Testing username...")
        and1_user = User.objects.get(username="Andrei")
        self.assertNotEqual(and1_user, User.DoesNotExist)
        self.assertEqual(and1_user.getUsername(), "Andrei")           
    
    def testPassword(self):
        print("Testing password...")
        and1_user = User.objects.get(username="Andrei")
        self.assertNotEqual(and1_user, User.DoesNotExist)
        self.assertEqual(and1_user.getPassword(), "123")


class TaskTestCase(UserTestCase):
    def setUp(self):
        super().setUp()
        Board.objects.create(name="Board1")
        Task.objects.create(
            name="Create frontend", 
            description="Do it now",
            priority="NS",
            board=Board.objects.get(name="Board1")
        )
    def testConnections(self):
        tsk1 = Task.objects.get(name="Create frontend")
        bd1 = Board.objects.get(name="Board1")
        usr = User.objects.get(username="Andrei")

        self.assertNotEqual(tsk1, User.DoesNotExist)
        self.assertNotEqual(bd1, User.DoesNotExist)
        self.assertNotEqual(usr, User.DoesNotExist)

        bd1.editors.add(usr)

        print("Testing editors and board sync...")
        self.assertEqual(bd1.getEditors().all().contains(usr), True)
        self.assertEqual(usr.getBoards().contains(bd1),  True)

        print("Testing board and task sync...")
        self.assertEqual(bd1.getTasks().contains(tsk1), True)
        self.assertEqual(tsk1.getBoard(), bd1)

        print("Testing removing board editor sync...")
        bd1.editors.remove(usr)
        self.assertEqual(bd1.getEditors().exists(), False)
        self.assertEqual(usr.getBoards().contains(bd1), False)


        
