from django.shortcuts import render

print("In App views...")

# Create your views here.
def index(request):
    return render(request, 'homePg.html')
