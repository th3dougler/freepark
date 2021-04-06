from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required

import json


#import db models
from .models import Comment, Spot
from django.contrib.auth.models import User


def spotlist(request):
    bounds = request.GET
    lat1 = float(bounds.getlist('lat1')[0])
    lat2 = float(bounds.getlist('lat2')[0])
    lon1 = float(bounds.getlist('lon1')[0])
    lon2 = float(bounds.getlist('lon2')[0])
    
    list = Spot.objects.all().filter(
        lat__lte=lat1, lat__gte=lat2,
        lon__lte=lon1, lon__gte=lon2,
        )
    json_arr = []
    for spot in list:
        json_arr.append(json.loads(spot.geojson))
    return HttpResponse(json.dumps(json_arr), content_type='application/json')

@login_required
def addspot(request):
    if request.method == 'POST':
        # convert byte array to string
        body = request.body.decode("utf-8")
        body_json = json.loads(body)
        data={
            'addSpot': request.body.decode("utf-8")
            }
        
        newSpot = Spot.objects.create(
            user_id = request.user.id,
            lat = body_json['geometry']['coordinates'][1],
            lon = body_json['geometry']['coordinates'][0],
            geojson = body
        )
        dump = json.dumps(data)
    return HttpResponse(dump, content_type='application/json')