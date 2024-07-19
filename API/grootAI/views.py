from django.shortcuts import render
import json
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .agent import groot_ai

@require_http_methods(["POST"])
def chat(request):
    input_json = json.loads(request.body.decode('utf-8'))
    response = groot_ai(input_json)
    return JsonResponse({'output': response})


@require_http_methods(["POST"])
def test(request):
    input_json = json.loads(request.body.decode('utf-8'))
    prompt = ""
    for key in iter(input_json):
        prompt = prompt + str(key) + " : " + str(input_json[key]) + " \n"
    print(prompt)
    return JsonResponse({'message': prompt})