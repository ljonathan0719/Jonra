# README

**How to setup Django**
1) Clone repository
2) Make sure your CLI supports python (i.e. run 'python --version')
3) In project directory, run 'python -m pip install Django'
4) Verify installation by running 'python -m django --version'

**Running the server**
Run 'python manage.py runserver'

**Testing the Database**
1) In Backend folder, run: 'python manage.py shell' where a python shell should open
2) To import objects, type: 'from models.models import *'
3) To see all objects of a class (i.e. User), type 'User.objects.all()'
4) Type 'quit()' to exit
