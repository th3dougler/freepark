from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

#import class based views + forms
from django.contrib.auth.forms import UserCreationForm

#import db models
from .models import Comment, Spot, Profile

import uuid
import boto3
S3_BASE_URL = 'https://s3-accesspoint.us-east-2.amazonaws.com/'
BUCKET = 'freepark-profile'
# main_app

def Main_App_Home(request):
    return render(request, 'main_app/main_app_home.html')


# /accounts views
@login_required
def profile(request):
  print(request.user.id)
  user_profile = Profile.objects.get(user_id = request.user.id)
  print(user_profile)
  return render(request, 'registration/profile.html',{'profile': user_profile})

@login_required
def add_photo(request):
  profile_pic = request.FILES.get('profile-pic', None)
  if profile_pic:
    s3 = boto3.client('s3')
    # need a unique "key" for S3 / needs image file extension too
    key = uuid.uuid4().hex[:6] + profile_pic.name[profile_pic.name.rfind('.'):]
    # just in case something goes wrong
    try:
      s3.upload_fileobj(profile_pic, BUCKET, key)
      # build the full url string
      url = f"{S3_BASE_URL}{BUCKET}/{key}"
      # we can assign to cat_id or cat (if you have a cat object)
      profile = Profile.objects.update_or_create(user = request.user, url= url)
      
    except:
            print('An error occurred uploading file to S3')
    return redirect('profile')
  
    
def signup(request):
  error_message = ''
  if request.method == 'POST':
    form = UserCreationForm(request.POST)
    if form.is_valid():
      user = form.save()
      login(request, user)
      Profile.objects.create(user_id = request.user.id)
      return redirect('profile')
    else:
      error_message = 'Invalid sign up - try again'
  # A bad POST or a GET request, so render signup.html with an empty form
  form = UserCreationForm()
  context = {'form': form, 'error_message': error_message}
  return render(request, 'registration/signup.html', context)    
