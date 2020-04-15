from django.conf.urls import url, include

from . import views

urlpatterns = [
    url(r'^api/lesson/post/(?P<lesson_id>[0-9a-f-]+)$', views.LessonCreateUpdate.as_view(), name='lesson-fetch'),
    url(r'^api/lesson/post/work/$', views.LessonWork.as_view(), name='lesson-work'),
    url(r'^api/lessons/$', views.LessonList.as_view(), name='lesson-list'),
    url(r'^api/lesson/post/$', views.LessonCreateUpdate.as_view(), name='lesson-post'),
    url(r'^api/lesson/(?P<lesson_id>[0-9a-f-]+)$', views.LessonWork.as_view(), name='lesson-work'),
]
