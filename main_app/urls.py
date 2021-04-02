from django.urls import path
from . import views
from django.contrib.auth.decorators import login_required

urlpatterns= [
    path('', views.Main_App_Home, name="main-app-home"),
    #accounts
    path('accounts/profile/', views.profile, name="profile"),
    path('accounts/signup/', views.signup, name="signup"),
    
    
]