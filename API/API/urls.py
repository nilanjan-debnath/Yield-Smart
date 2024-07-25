from django.urls import path
from . import views

urlpatterns = [
    path('groot-ai/', views.chatThroughFirebase, name="groot-ai"),
    path('test/', views.test, name="test"),
    path('', views.directChat, name="Direct Chat"),
]