from django.urls import path
from . import views, api_views
from django.contrib.auth.decorators import login_required

urlpatterns= [
    path('', views.Main_App_Home, name="main-app-home"),
    path('<int:spotid>', views.Main_App_Home, name="main-app-home-refer"),
    
    path('<int:pk>/detail', views.Main_App_Detail, name="main-app-detail"),
    path('<int:pk>/comment', views.Main_App_Add_Comment, name="main-app-add-comment"),
    
    
    path('addspot/', views.addspot, name="main-app-addspot"),
    
    #accounts
    path('accounts/profile/', views.profile, name="profile"),

    path('accounts/profile/add_photo', views.add_photo, name="add-photo"),

    # path('accounts/profile/favorites/', views.favorites, name='favorites'),
    
    path('accounts/signup/', views.signup, name="signup"),
    
    path('api/spotlist', api_views.spotlist, name='api-spotlist'),
    path('api/addspot', api_views.addspot, name='api-addspot'),
]