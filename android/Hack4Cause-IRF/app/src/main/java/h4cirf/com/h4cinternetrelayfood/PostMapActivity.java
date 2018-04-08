package h4cirf.com.h4cinternetrelayfood;

import android.location.Address;
import android.location.Geocoder;
import android.support.v4.app.FragmentActivity;
import android.os.Bundle;
import android.widget.ListView;
import android.widget.SearchView;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import h4cirf.com.h4cinternetrelayfood.models.PostModel;
import h4cirf.com.h4cinternetrelayfood.models.PostSearchModel;
import h4cirf.com.h4cinternetrelayfood.models.SearchReturnModel;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class PostMapActivity extends FragmentActivity implements OnMapReadyCallback {

    private GoogleMap mMap;

    // My stuff :)
    private final int POSTS_PER_PAGE = 20;
    private int currentPostStart = 0;
    private ArrayList<PostModel> posts;
    SearchView searchView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_post_map);
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);
    }


    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;

        // Add a marker in Sydney and move the camera
        LatLng sydney = new LatLng(-34, 151);
        mMap.addMarker(new MarkerOptions().position(sydney).title("Marker in Sydney"));
        mMap.moveCamera(CameraUpdateFactory.newLatLng(sydney));
    }
    public LatLng getLocationFromAddress(String strAddress){

        Geocoder coder = new Geocoder(this);
        List<Address> address;
        LatLng p1 = null;

        try {
            address = coder.getFromLocationName(strAddress,5);
            if (address==null) {
                return null;
            }
            Address location = address.get(0);

            p1 = new LatLng(location.getLatitude(), location.getLongitude());

            return p1;
        }
        catch(IOException e)
        {
            System.err.println(e.getMessage());
            return new LatLng(-34, 151);
        }
    }

    private void fetchList()
    {
        String query = "";
        // If we aren't searching for anything i.e. our query is empty, get everything
        if(query.isEmpty()) {
            Call<ArrayList<PostModel>> call = MainActivity.api.doGetListResources(currentPostStart, POSTS_PER_PAGE);
            call.enqueue(new Callback<ArrayList<PostModel>>() {
                @Override
                public void onResponse(Call<ArrayList<PostModel>> call, Response<ArrayList<PostModel>> response) {
                    // If we got
                    if (response.isSuccessful()) {
                        posts.clear();
                        posts.addAll(response.body());
                    }
                }

                @Override
                public void onFailure(Call<ArrayList<PostModel>> call, Throwable t) {
                    System.err.println("We goofed");
                }
            });
        }
        else
        {
        }
    }
}
