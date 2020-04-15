from django.shortcuts import render

# Create your views here.

def index(request, page=''):
    return render(request, 'frontend/index.html')

def book(request, what='', page=''):
    return render(request, 'frontend/index.html')

def lesson(request, lesson_id='', ):
    print('lesson')
    print(lesson_id)
    return render(request, 'frontend/index.html')

def word(request, word='', ):
    print('word')
    print(word)
    return render(request, 'frontend/index.html')
