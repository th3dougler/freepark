from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required

#import class based views + forms
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib.auth.forms import UserCreationForm

#import db models
from .models import Comment, Spot
from django.contrib.auth.models import User


# main_app

def Main_App_Home(request):
    return render(request, 'main_app/main_app_home.html')


# /accounts views

def profile(login_required, request):
    return render(request, 'registration/profile.html',{
        'user': request.user
    })
    
def signup(request):
  error_message = ''
  if request.method == 'POST':
    form = UserCreationForm(request.POST)
    if form.is_valid():
      user = form.save()
      login(request, user)
      return redirect('profile')
    else:
      error_message = 'Invalid sign up - try again'
  # A bad POST or a GET request, so render signup.html with an empty form
  form = UserCreationForm()
  context = {'form': form, 'error_message': error_message}
  return render(request, 'registration/signup.html', context)    
