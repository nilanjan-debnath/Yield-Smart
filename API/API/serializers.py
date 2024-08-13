from rest_framework import serializers

class FirebaseSerializers(serializers.Serializer):
    id = serializers.CharField()
    index = serializers.IntegerField()
    
class DirectChatSerializers(serializers.Serializer):
    input = serializers.CharField()
    image = serializers.URLField(default=False)

class ImageChatSerializers(serializers.Serializer):
    image = serializers.URLField()