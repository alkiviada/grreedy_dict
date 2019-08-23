from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^(?P<page>\d+)$', views.index, name='index'),
    url(r'^login/', views.index, name='index'),
    url(r'^register/', views.index, name='index'),
    url(r'^logout/', views.index, name='index'),
]
