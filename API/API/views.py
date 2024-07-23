from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import FirebaseSerializers, DirectChatSerializers

from grootAI import agent

@api_view(['POST'])
def chatThroughFirebase(request):
    serializer = FirebaseSerializers(data=request.data)
    if serializer.is_valid(raise_exception=True):
        response = agent.groot_ai(serializer.data)
    return Response({'output': response})

@api_view(['POST'])
def test(request):
    serializer = FirebaseSerializers(data=request.data)
    if serializer.is_valid(raise_exception=True):
        data = serializer.data
        data.update({"message":"Data received successfully"})
    return Response(data)

@api_view(['POST'])
def directChat(request):
    serializer = DirectChatSerializers(data=request.data)
    if serializer.is_valid(raise_exception=True):
        response = agent.direct_chat(serializer.data)
    return Response({'output': response})

