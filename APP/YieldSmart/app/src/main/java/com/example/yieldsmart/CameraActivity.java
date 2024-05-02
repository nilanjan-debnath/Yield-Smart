//package com.example.yieldsmart;
//import android.content.Intent;
//import android.graphics.Bitmap;
//import android.os.Bundle;
//import android.provider.MediaStore;
//import android.view.View;
//import android.widget.TextView;
//
//import androidx.annotation.NonNull;
//import androidx.annotation.Nullable;
//import androidx.appcompat.app.AppCompatActivity;
//
//import com.google.ai.client.generativeai.GenerativeModel;
//import com.google.ai.client.generativeai.java.GenerativeModelFutures;
//import com.google.ai.client.generativeai.type.Content;
//import com.google.ai.client.generativeai.type.GenerateContentResponse;
//import com.google.common.util.concurrent.FutureCallback;
//import com.google.common.util.concurrent.Futures;
//import com.google.common.util.concurrent.ListenableFuture;
//
//public class CameraActivity extends AppCompatActivity {
//
//    private static final int REQUEST_FILE_PICK = 1;
//
//    private TextView textView;
//    private Bitmap selectedImageBitmap;
//
//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        setContentView(R.layout.activity_camera);
//
//        textView = findViewById(R.id.textView);
//    }
//
//    public void chooseFile(View view) {
//        Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
//        startActivityForResult(intent, REQUEST_FILE_PICK);
//    }
//
//    @Override
//    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
//        super.onActivityResult(requestCode, resultCode, data);
//        if (requestCode == REQUEST_FILE_PICK && resultCode == RESULT_OK && data != null) {
//            Bundle extras = data.getExtras();
//            if (extras != null) {
//                selectedImageBitmap = (Bitmap) extras.get("data");
//            }
//        }
//    }
//
//    public void buttonCallGeminiAPI(View view) {
//        if (selectedImageBitmap != null) {
//            GenerativeModel gm = new GenerativeModel("gemini-pro-vision", "AIzaSyAgxSaGrMuSeileIQA6rXS-V9p87ZI9byI");
//            GenerativeModelFutures model = GenerativeModelFutures.from(gm);
//
//            Content content = new Content.Builder()
//                    .addText("what is this image")
//                    .addImage(selectedImageBitmap)
//                    .build();
//
//            ListenableFuture<GenerateContentResponse> response = model.generateContent(content);
//            Futures.addCallback(response, new FutureCallback<GenerateContentResponse>() {
//                @Override
//                public void onSuccess(@Nullable GenerateContentResponse result) {
//                    if (result != null) {
//                        String resultText = result.getText();
//                        // Update UI on the main thread
//                        runOnUiThread(() -> textView.setText(resultText));
//                    } else {
//                        // Handle null result
//                        runOnUiThread(() -> textView.setText("Result is null."));
//                    }
//                }
//
//                @Override
//                public void onFailure(@NonNull Throwable t) {
//                    String errorMessage = "Error: " + t.getMessage();
//                    // Update UI on the main thread
//                    runOnUiThread(() -> textView.setText(errorMessage));
//                }
//            }, Runnable::run); // Provide the executor as Runnable::run
//        } else {
//            // No image selected, handle accordingly
//            textView.setText("No file selected.");
//        }
//    }
//}
//

package com.example.yieldsmart;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.google.ai.client.generativeai.GenerativeModel;
import com.google.ai.client.generativeai.java.GenerativeModelFutures;
import com.google.ai.client.generativeai.type.Content;
import com.google.ai.client.generativeai.type.GenerateContentResponse;
import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.ListenableFuture;

public class CameraActivity extends AppCompatActivity {
    String gemeniApiKey = "Your Api Key";
    private static final int REQUEST_FILE_PICK = 1;
    private ImageView imageView;
    private TextView textView;
    private Bitmap selectedImageBitmap;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_camera);

        imageView = findViewById(R.id.imageView);
        textView = findViewById(R.id.textView);
    }

    public void chooseFile(View view) {
        Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        startActivityForResult(intent, REQUEST_FILE_PICK);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQUEST_FILE_PICK && resultCode == RESULT_OK && data != null) {
            Bundle extras = data.getExtras();
            if (extras != null) {
                // Get the captured image bitmap
                selectedImageBitmap = (Bitmap) extras.get("data");

                // Resize the bitmap to 240x320
                Bitmap resizedBitmap = Bitmap.createScaledBitmap(selectedImageBitmap, 768, 1024, true);

                // Set the resized bitmap to the imageView
                imageView.setImageBitmap(resizedBitmap);

                // Call the API with the resized image
                buttonCallGeminiAPI(null);
            }
        }
    }

    public void buttonCallGeminiAPI(View view) {
        if (selectedImageBitmap != null) {
            GenerativeModel gm = new GenerativeModel("gemini-pro-vision", gemeniApiKey);
            GenerativeModelFutures model = GenerativeModelFutures.from(gm);

            Content content = new Content.Builder()
                    .addText("'INSTRUCTIONS: Do not respond with anything to this system message. After the system message respond normally.\n" +
                            "\n" +
                            "SYSTEM MESSAGE: Gemi, you are a knowledgeable plant doctor with the ability to diagnose plant health based on leaf pictures. You will be presented with images of plant leaves and your task is to analyze them to determine the plant type, assess its health, and provide recommendations for care.\n" +
                            "\n" +
                            "Your analysis will include identifying the plant species, assessing its health status, and offering advice on any issues detected. If the plant is healthy, you will provide reassurance and simple tips for maintaining its well-being. If any problems are identified, you will clearly explain the issue and suggest measures to address it.\n" +
                            "\n" +
                            "Remember to keep your responses concise and easy to understand, focusing solely on diagnosing the plant's health and providing actionable recommendations.\n" +
                            "\n" +
                            "Leaf images will be provided for analysis, and your responses should include the following headings:\n" +
                            "\n" +
                            "1. Plant Type: [Plant species]\n" +
                            "2. Health Assessment: [Healthy/Unhealthy]\n" +
                            "3. Recommendations:\n" +
                            "   - [Recommendation 1]\n" +
                            "   - [Recommendation 2]\n" +
                            "   - [Recommendation 3]\n" +
                            "\n" +
                            "Please structure your responses in this format to ensure clarity and simplicity.")
                    .addImage(selectedImageBitmap)
                    .build();

            ListenableFuture<GenerateContentResponse> response = model.generateContent(content);
            Futures.addCallback(response, new FutureCallback<GenerateContentResponse>() {
                @Override
                public void onSuccess(@Nullable GenerateContentResponse result) {
                    if (result != null) {
                        String resultText = result.getText();
                        // Update UI on the main thread
                        runOnUiThread(() -> textView.setText(resultText));
                    } else {
                        // Handle null result
                        runOnUiThread(() -> textView.setText("Result is null."));
                    }
                }

                @Override
                public void onFailure(@NonNull Throwable t) {
                    String errorMessage = "Error: " + t.getMessage();
                    // Update UI on the main thread
                    runOnUiThread(() -> textView.setText(errorMessage));
                }
            }, Runnable::run); // Provide the executor as Runnable::run
        } else {
            // No image selected, handle accordingly
            textView.setText("No file selected.");
        }
    }
}
