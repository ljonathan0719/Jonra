from django.test import TestCase, Client
from models.models import User, Task, Board

class TestRoutes(TestCase):
    def testSignup(self):
        c = Client()
        res = c.post("/signup/", {"user": "Mary", "password": "123"}, content_type='application/json')
        self.assertEqual(res.status_code, 201)
        self.assertEqual(User.objects.get(username="Mary").getPassword(), "123")

        u = User(username="jon", password="1234")
        u.save()
        res = c.post("/signup/", {"user": "jon", "password": "1234"}, content_type='application/json')
        self.assertEqual(res.status_code, 400)
        self.assertEqual(res.json()['message'], "User already exists")
        u.delete()

        res = c.post("/signup/", {"user": "Mary", "password": ""}, content_type='application/json')
        self.assertEqual(res.status_code, 400)
        self.assertEqual(res.json()['message'], "Missing one or more fields")

        res = c.post("/signup/", {"user": "", "password": "1234"}, content_type='application/json')
        self.assertEqual(res.status_code, 400)
        self.assertEqual(res.json()['message'], "Missing one or more fields")
