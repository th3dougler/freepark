from django.urls import path
from . import views, api_views
from django.contrib.auth.decorators import login_required

urlpatterns= [
    path('', views.Main_App_Home, name="main-app-home"),
    #accounts
    path('accounts/profile/', views.profile, name="profile"),
    path('accounts/profile/add_photo', views.add_photo, name="add-photo"),
    
    path('accounts/signup/', views.signup, name="signup"),
    
    path('api/spotlist', api_views.spotlist, name='api-spotlist')
]