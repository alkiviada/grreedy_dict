from django.shortcuts import render

# Create your views here.

def index(request, page=''):
    return render(request, 'frontend/index.html')

def book(request, what='', page=''):
    return render(request, 'frontend/index.html')
