package com.example.yieldsmart.ui.dashboard;

import android.os.AsyncTask;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.yieldsmart.R;
import com.example.yieldsmart.databinding.FragmentDashboardBinding;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class DashboardFragment extends Fragment {

    private FragmentDashboardBinding binding;
    private TextView userLocation;
    private TextView weatherForecast;
    private TextView humidity;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        DashboardViewModel dashboardViewModel =
                new ViewModelProvider(this).get(DashboardViewModel.class);

        binding = FragmentDashboardBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        // Initialize TextViews
        userLocation = root.findViewById(R.id.userLocation);
        weatherForecast = root.findViewById(R.id.weatherforecast);
        humidity = root.findViewById(R.id.humidity);

        // Make API request
        new FetchWeatherTask().execute();

        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

    private class FetchWeatherTask extends AsyncTask<Void, Void, String> {

        @Override
        protected String doInBackground(Void... voids) {
            HttpURLConnection urlConnection = null;
            BufferedReader reader = null;
            String forecastJsonStr = null;

            try {
                // Construct the URL
                URL url = new URL("https://api.openweathermap.org/data/2.5/weather?lat=22.559509257403146&lon=88.39636168883519&units=metric&appid=11e3cf08706a5755f4cde00f819ad805");

                // Create the request to OpenWeatherMap API, and open the connection
                urlConnection = (HttpURLConnection) url.openConnection();
                urlConnection.setRequestMethod("GET");
                urlConnection.connect();

                // Read the input stream into a String
                InputStream inputStream = urlConnection.getInputStream();
                StringBuilder buffer = new StringBuilder();
                if (inputStream == null) {
                    return null;
                }
                reader = new BufferedReader(new InputStreamReader(inputStream));

                String line;
                while ((line = reader.readLine()) != null) {
                    buffer.append(line).append("\n");
                }

                if (buffer.length() == 0) {
                    return null;
                }
                forecastJsonStr = buffer.toString();
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                if (urlConnection != null) {
                    urlConnection.disconnect();
                }
                if (reader != null) {
                    try {
                        reader.close();
                    } catch (final IOException e) {
                        e.printStackTrace();
                    }
                }
            }

            return forecastJsonStr;
        }

        @Override
        protected void onPostExecute(String result) {
            if (result != null) {
                try {
                    JSONObject json = new JSONObject(result);

                    // Parse JSON response
                    String name = json.getString("name");
                    JSONObject main = json.getJSONObject("main");
                    int temp = main.getInt("temp");
                    int humidityValue = main.getInt("humidity");

                    // Update TextViews
                    userLocation.setText(name);
                    weatherForecast.setText(String.valueOf(temp));
                    humidity.setText(String.valueOf(humidityValue));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            } else {
                Toast.makeText(getContext(), "Failed to fetch weather data", Toast.LENGTH_SHORT).show();
            }
        }
    }
}
