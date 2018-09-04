from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^api/word/(?P<word>[-\w]+)$', views.WordSingleCreate.as_view(), name='word-detail' ),
    url(r'^api/word/(?P<translate>[-\w]+)/(?P<word>[-\w]+)$', views.WordSingleCreateTranslate.as_view(), name='word-translate' ),
    url(r'^api/word/$', views.WordList.as_view(), name='words' ),
]
