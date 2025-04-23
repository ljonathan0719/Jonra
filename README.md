# README

**How to setup Django**
1) Go to https://www.python.org/downloads/ to install Python on your command line.
2) Make sure that the path to the Python executable is added as a path in Environment Variables
3) Verify that the command “python –version” works. If not, verify if the steps above were done correctly.
4) Clone the github repository above with: “git clone https://github.com/JonKissil/Jonra.git”
5) Go into the folder, and with Pip, run “python -m pip install Django”
6) Verify the installation worked by running “python -m django --version”
7) Go to the “jonra-app” folder and with npm, run “npm install”
8) If you do not have npm, ensure you have Node installed (if not: follow https://nodejs.org/en/download/) by running “node -v” to check
9) Check to see if npm is there by running “npm -v”
10) Now, you should be all setup!

**Running the App**
1) Go to “Backend/” and run “python manage.py runserver”
2) Go to “jonra-app/” and run “npm start” in a separate terminal
3) The app should appear as a new page in a browser.

**Running the server**
Run 'python manage.py runserver'

**Running tests**
1) In Backend folder, run: 'python manage.py test __app/folder__'
2) Results should display in console (0 errors returns: OK)

**Testing the Database using Shell**
1) In Backend folder, run: 'python manage.py shell' where a python shell should open
2) To import objects, type: 'from models.models import *'
3) To see all objects of a class (i.e. User), type 'User.objects.all()'
4) Type 'quit()' to exit
