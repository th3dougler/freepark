from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
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