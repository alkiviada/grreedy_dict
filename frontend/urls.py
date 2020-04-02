from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^lessons$', views.lesson, name='lesson-list'),
    url(r'^book/(?P<what>[-\'\w() ]+)/(?P<page>\d+)$', views.book, name='book'),
    url(r'^lesson/post/(?P<lesson_id>[0-9a-f-]+)?$', views.lesson, name='lesson-post'),
    url(r'^lesson/(?P<lesson_id>[0-9a-f-]+)?$', views.lesson, name='lesson'),
    url(r'^(?P<page>\d+)$', views.index, name='index'),
    url(r'^login/', views.index, name='index'),
    url(r'^register/', views.index, name='index'),
    url(r'^logout/', views.index, name='index'),
]
