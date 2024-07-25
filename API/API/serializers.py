from rest_framework import serializers

class FirebaseSerializers(serializers.Serializer):
    id = serializers.CharField()
    index = serializers.IntegerField()
    
class DirectChatSerializers(serializers.Serializer):
    # email = serializers.EmailField()
    input = serializers.CharField()
    image = serializers.URLField(default=False)