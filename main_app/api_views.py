from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required

import json


#import db models
from .models import Comment, Spot
from django.contrib.auth.models import User


def spotlist(request):
    data={
        'foo': 'Bar'
    }
    dump = json.dumps(data)
    print(dump)
    return HttpResponse(dump, content_type='application/json')

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
            lat = body_json['geometry']['coordinates'][0],
            lon = body_json['geometry']['coordinates'][0],
            geojson = body
        )
        dump = json.dumps(data)
    return HttpResponse(dump, content_type='application/json')