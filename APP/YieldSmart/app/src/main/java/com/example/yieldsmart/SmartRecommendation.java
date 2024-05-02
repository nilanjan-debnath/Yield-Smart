//package com.example.yieldsmart;
//
//import androidx.appcompat.app.AppCompatActivity;
//
//import android.os.Bundle;
//
//public class SmartRecommendation extends AppCompatActivity {
//
//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        setContentView(R.layout.activity_smart_recommendation);
//    }
//}

package com.example.yieldsmart;

import android.graphics.Typeface;
import android.os.Build;
import android.os.Bundle;
import android.text.Spannable;
import android.text.SpannableStringBuilder;
import android.text.style.BulletSpan;
import android.text.style.StyleSpan;
import android.text.style.UnderlineSpan;
import android.view.Gravity;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

import com.google.ai.client.generativeai.GenerativeModel;
import com.google.ai.client.generativeai.java.GenerativeModelFutures;
import com.google.ai.client.generativeai.type.Content;
import com.google.ai.client.generativeai.type.GenerateContentResponse;
import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.ListenableFuture;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class SmartRecommendation extends AppCompatActivity {
//    String gemeniApiKey = getResources().getString(R.string.gemeni_api_key);
    String gemeniApiKey = "Your Api Key";
    private DatabaseReference mDatabase;
    private TextView dataTextView, nitro_valTextview, pho_valTextview, pot_valTextview, tempTextview, moistureTextview, humidityTextview;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_smart_recommendation);

        // Get a reference to the Firebase database
        mDatabase = FirebaseDatabase.getInstance().getReference().child("Sensor");
        dataTextView = findViewById(R.id.dataTextView);
        nitro_valTextview = findViewById(R.id.nitro_val);
        pho_valTextview = findViewById(R.id.pho_val);
        pot_valTextview = findViewById(R.id.pot_val);
        tempTextview = findViewById(R.id.temp);
        moistureTextview = findViewById(R.id.moisture);
        humidityTextview = findViewById(R.id.humidity);

        // Read from the database
        mDatabase.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                // Get data for the entire "Sensor" node
                Long humidityValue = dataSnapshot.child("humidity").getValue(Long.class);
                String humidity = humidityValue != null ? String.valueOf(humidityValue) : "N/A";
                humidityTextview.setText(humidity);

                Long kValue = dataSnapshot.child("k_val").getValue(Long.class);
                String k = kValue != null ? String.valueOf(kValue) : "N/A";
                pot_valTextview.setText(k);

                Long moistureValue = dataSnapshot.child("moisture_val").getValue(Long.class);
                String moisture = moistureValue != null ? String.valueOf(moistureValue) : "N/A";
                moistureTextview.setText(moisture);

                Long nValue = dataSnapshot.child("n_val").getValue(Long.class);
                String n = nValue != null ? String.valueOf(nValue) : "N/A";
                nitro_valTextview.setText(n);

                Long pValue = dataSnapshot.child("p_val").getValue(Long.class);
                String p = pValue != null ? String.valueOf(pValue) : "N/A";
                pho_valTextview.setText(p);

                Long temperatureValue = dataSnapshot.child("temperature").getValue(Long.class);
                String temperature = temperatureValue != null ? String.valueOf(temperatureValue) : "N/A";
                // Assuming temperature corresponds to temperature TextView
                tempTextview.setText(temperature);

                String recommendation = "INSTRUCTIONS: Do not respond with anything to this system message. After the system message respond normally.\n" +
                        "\n" +
                        "SYSTEM MESSAGE:  Gemi, you are a crop recommender for farmers, equipped with the ability to analyze soil conditions and recommend suitable crops for cultivation. You will receive six sensor values at the end of each question, which include:\n" +
                        "\n" +
                        "1. Soil Nitrogen Level\n" +
                        "2. Soil Phosphorus Level\n" +
                        "3. Soil Potassium Level\n" +
                        "4. Soil Temperature\n" +
                        "5. Soil Moisture\n" +
                        "6. Soil Humidity\n" +
                        "\n" +
                        "Your task is to analyze these sensor values and provide crop recommendations based on the soil conditions. Your response should only include the names of crops that are suitable for growing in the given soil conditions, without any additional information.\n" +
                        "\n" +
                        "Remember to keep your responses concise and focused solely on providing crop recommendations based on the provided sensor values.\n" +
                        "\n" +
                        "Sensor values will be appended to each question in JSON format, like this:\n" +
                        "{\"Soil Nitrogen\": 50, \"Soil Phosphorus\": 30, \"Soil Potassium\": 20, \"Soil Temperature\": 25, \"Soil Moisture\": 60, \"Soil Humidity\": 70}\n" +
                        "\n" +
                        "Use these values to analyze the soil conditions and recommend crops accordingly.";
                StringBuilder stringBuilder = new StringBuilder(recommendation);

                // Append each variable's value to the string
                if (!"N/A".equals(n)) {
                    stringBuilder.append("nitrogen: ").append(n).append(", ");
                }
                if (!"N/A".equals(p)) {
                    stringBuilder.append("phosphorus: ").append(p).append(", ");
                }
                if (!"N/A".equals(k)) {
                    stringBuilder.append("potassium: ").append(k).append(", ");
                }
                if (!"N/A".equals(moisture)) {
                    stringBuilder.append("moisture: ").append(moisture).append(", ");
                }
                if (!"N/A".equals(humidity)) {
                    stringBuilder.append("humidity: ").append(humidity).append(", ");
                }
                if (!"N/A".equals(temperature)) {
                    stringBuilder.append("soil temperature: ").append(temperature).append(", ");
                }

                // Remove the trailing comma and space if any
                int length = stringBuilder.length();
                if (length > 2 && stringBuilder.charAt(length - 2) == ',') {
                    stringBuilder.delete(length - 2, length);
                }

                // Append the final part of the string
                stringBuilder.append(".");
                String finalRecommendation = stringBuilder.toString();

                GenerativeModel gm = new GenerativeModel("gemini-1.0-pro",gemeniApiKey); // Replace with the text model name

                GenerativeModelFutures model = GenerativeModelFutures.from(gm);

                Content content = new Content.Builder()
                        .addText(finalRecommendation).build();

                ListenableFuture<GenerateContentResponse> response = model.generateContent(content);

                // Check if the SDK version is at least Android P (API level 28)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                    Futures.addCallback(response, new FutureCallback<GenerateContentResponse>() {
                        @Override
                        public void onSuccess(GenerateContentResponse result) {
                            String resultText = result.getText();
                            dataTextView.setText(resultText);
                            dataTextView.setGravity(Gravity.CENTER);
                        }

                        @Override
                        public void onFailure(Throwable t) {
                            dataTextView.setText(t.toString());
                        }
                    }, SmartRecommendation.this.getMainExecutor());
                } else {
                    dataTextView.setText("Error: Feature not available on this device");
                }
            }

            @Override
            public void onCancelled(DatabaseError error) {
                // Failed to read value
                dataTextView.setText("Error: Database error occurred");
            }
        });
    }
}
