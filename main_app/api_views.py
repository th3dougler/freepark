from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
import os
import json
import uuid
import boto3
S3_BASE_URL = 's3.us-east-2.amazonaws.com'
BUCKET = 'freepark-profile'
#import db models
from .models import Comment, Spot
from django.contrib.auth.models import User

# take bounds of visible map, return spots which are within those bounds
def spotlist(request):
    bounds = request.GET
    lat1 = float(bounds.get('lat1'))
    lat2 = float(bounds.get('lat2'))
    lon1 = float(bounds.get('lon1'))
    lon2 = float(bounds.get('lon2'))
    
    list = Spot.objects.all().filter(
        lat__lte=lat1, lat__gte=lat2,
        lon__lte=lon1, lon__gte=lon2,
        )
    json_arr = []
    for spot in list:
        json_arr.append(json.loads(spot.geojson))
    return HttpResponse(json.dumps(json_arr), content_type='application/json')


# add a new Spot row, use image if it exists
# in order to save the id of the row to the geojson, i save the row
# then update the geojson column with the PK
@login_required
def addspot(request):
    if request.method == 'POST':
        body = request.POST
        newSpot = Spot(
            user_id = request.user.id,
            lat = float(body.get('lat')),
            lon = float(body.get('lon')),
            geojson = ""
        )
        newSpot.save()
        geojson = {
            "type": "Feature",
            "properties": {
                "name": body.get('addr'),
                "user": request.user.id,
                "spot": newSpot.id,
                "notes": body.get('notes'),
                "popupContent": f"<a href='/{newSpot.id}/detail'>Detail</a><br/><p>{body.get('addr')}</p> "
                },
            "geometry": {
                "type": "Point",
                "coordinates": [float(body.get('lon')), float(body.get('lat'))]
                }
            }
        # get image file
        spot_image = request.FILES.get('image', None)
        print(spot_image)
        Spot.objects.filter(pk=newSpot.id).update(geojson=json.dumps(geojson))
        if spot_image:
            s3 = boto3.client('s3',
                aws_access_key_id=os.environ['AWS_ACCESS_ID'],
                aws_secret_access_key=os.environ['AWS_ACCESS_KEY']
                              )
            s3.list_buckets()
            # need a unique "key" for S3 / needs image file extension too
            key = uuid.uuid4().hex[:6] + spot_image.name[spot_image.name.rfind('.'):]
            # just in case something goes wrong
            try:
                s3.upload_fileobj(spot_image, BUCKET, key)
                # build the full url string
                url = f"https://{BUCKET}.{S3_BASE_URL}/{key}"
                print(url)
                # we can assign to cat_id or cat (if you have a cat object)
                Spot.objects.filter(pk=newSpot.id).update(url= url)
            except:
                print('An error occurred uploading file to S3')
        
        
        
    return redirect('main-app-home')