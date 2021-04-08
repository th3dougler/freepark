from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect

#import class based views + forms
from django.contrib.auth.forms import UserCreationForm

#import db models
from .models import Comment, Spot, Profile, Favorite
import os
import uuid
import boto3
import json
S3_BASE_URL = 's3.us-east-2.amazonaws.com'
BUCKET = 'freepark-profile'
# main_app
@login_required
def Main_App_Home(request, spotid = None):
  if spotid:
    spot= Spot.objects.get(pk=spotid).geojson
  else:
    spot= None
  return render(request, 'main_app/main_app_home.html',{'spot': spot})
@login_required
def Main_App_Detail(request, pk):
  thisSpot = Spot.objects.get(pk=pk)
  favorite = False
  if (thisSpot.favorite_set.filter(user_id = request.user.id )):
    favorite = True
  return render(request, 'main_app/main_app_detail.html',{
    'spot': thisSpot,
    'rating_range': range(0,5),
    'favorite': favorite,
    })
@login_required  
def Main_App_Add_Comment(request, pk):
  if request.method == 'POST':
    formData = request.POST
    Comment.objects.create(
      spot_id = pk,
      user_id = request.user.id,
      rating = formData.get('rating'),
      notes =  formData.get('notes'),
    )
    
  return redirect('main-app-detail', pk = pk)
@login_required  
def Main_App_Add_Favorite(request, pk):
  if Favorite.objects.filter(spot_id = pk,user_id = request.user.id).exists():
    Favorite.objects.filter(spot_id = pk,user_id = request.user.id).delete()
  else:
    Favorite.objects.create(
      spot_id = pk,
      user_id = request.user.id,
    )
  return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))

""" {'lat': ['43.650981839898684'],
'lon': ['-79.42196846008302'],
'addr': ['St. Joseph Della Madonna, 108, Harrison Street, Little Italy, University—Rosedale, Old Toronto, Toronto, Golden Horseshoe, Ontario, M6J 3A6, Canada']} """
@login_required
def addspot(request):
  spotData = request.GET
  lat = spotData.getlist('lat')[0]
  lon = spotData.getlist('lon')[0]
  addr = spotData.getlist('addr')[0]
  return render(request, 'main_app/main_app_addspot.html', {
    'lat': lat,
    'lon': lon,
    'addr': addr,
  })

# /accounts views
@login_required
def profile(request):
  user_profile = Profile.objects.get(user_id = request.user.id)
  return render(request, 'registration/profile.html',{'rating_range': range(0,5)})

# @login_required
# def favorites(request):
#   # rediret to map with spots plotted or spots shown as cards?

@login_required
def add_photo(request):
  profile_pic = request.FILES.get('input-image', None)
  print(profile_pic)
  if profile_pic:
    s3 = boto3.client('s3',
        aws_access_key_id=os.environ['AWS_ACCESS_ID'],
        aws_secret_access_key=os.environ['AWS_ACCESS_KEY']
                      )
    # need a unique "key" for S3 / needs image file extension too
    key = uuid.uuid4().hex[:6] + profile_pic.name[profile_pic.name.rfind('.'):]
    # just in case something goes wrong
    try:
      s3.upload_fileobj(profile_pic, BUCKET, key)
      # build the full url string
      url = f"https://{BUCKET}.{S3_BASE_URL}/{key}"
      # we can assign to cat_id or cat (if you have a cat object)
      Profile.objects.filter(user_id = request.user.id).update(url=url)
    except:
      print('An error occurred uploading file to S3')
    return redirect('profile')
  return redirect('main-app-home')
  
    
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