package h4cirf.com.h4cinternetrelayfood;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.SearchView;

import com.amazonaws.http.HttpResponse;
import com.auth0.android.Auth0;
import com.auth0.android.management.UsersAPIClient;
import com.google.gson.Gson;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

import h4cirf.com.h4cinternetrelayfood.models.PostModel;
import h4cirf.com.h4cinternetrelayfood.models.PostSearchModel;
import h4cirf.com.h4cinternetrelayfood.models.SearchReturnModel;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


/**
 * A simple {@link Fragment} subclass.
 * to handle interaction events.
 * Use the {@link PostListFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class PostListFragment extends Fragment {
    private final int POSTS_PER_PAGE = 20;
    private int currentPostStart = 0;
    private ArrayList<PostModel> posts;
    private PostListAdapter adapter;
    private ListView listView;
    SearchView searchView;
    Intent intent;

    public PostListFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @return A new instance of fragment PostListFragment.
     */
    public static PostListFragment newInstance() {
        PostListFragment fragment = new PostListFragment();
        Bundle args = new Bundle();
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_post_list, container, false);

        /*
        // Go to map view
        //intent = new Intent(getActivity(), PostMapActivity);
        // final Button button = (Button) view.findViewById(R.id.mapButton);

        button.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                startActivity(intent);
            }
        });
        */

        // Get the first POSTS_PER_PAGE posts and put it in our list
        posts = new ArrayList<>();
        listView = view.findViewById(R.id.postListView);
        adapter = new PostListAdapter(getContext(), R.layout.post_list_item, posts);
        searchView = view.findViewById((R.id.postListSearch));
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                System.out.println("Query submitted: " + query);
                fetchList();
                return true;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                return true;
            }
        });
        view.requestFocus();
        //*
        // Populate our database
        MainActivity parentActivity = (MainActivity) getActivity();
        PostModel tempModel = new PostModel();
        tempModel.amount = "20";

        TimeZone tz = TimeZone.getTimeZone("UTC");
        DateFormat df = new SimpleDateFormat("yyy-MM-dd'T'HH:mm'Z'");
        df.setTimeZone(tz);
        String date = df.format(new Date());
        tempModel.creationDate = date;
        tempModel.description = "Lots of carrots";
        tempModel.pickupAddress = "1395 University St, Eugene, OR 97403";
        tempModel.readiness = "packed";
        tempModel.pickupWindow = "Now or never";
        tempModel.title = "Huge carrots!";
        tempModel.status = "available";
        tempModel.email = MainActivity.userProfile.getEmail();
        //tempModel.email = "b1t@ymail.com";
        //parentActivity.viewPost(tempModel);
        //for(int i = 0; i < 20; ++i)
        //    posts.add(tempModel);
        //*/
        /*

        System.out.println(new Gson().toJson(tempModel));
        MainActivity.api.doPostPost(MainActivity.tokenID, tempModel).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                System.out.println("Werked");
                System.out.println("Was succ? " + response.isSuccessful());
                //returnToMain(true);
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                System.err.println(" DEBUG: Failed: is tokenID null: " + (MainActivity.tokenID == null));
                //returnToMain(false);
            }
        });
        //*/

        // Get our list
        fetchList();
        // Populate our ListView
        listView.setAdapter(adapter);
        //*
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                PostModel selectedPost = (PostModel) parent.getItemAtPosition(position);
                ((MainActivity) getActivity()).viewPost(selectedPost);
                //System.out.println("Pressed post with position" + position);
            }
        });
        //*/
        return view;
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
    }

    @Override
    public void onDetach() {
        super.onDetach();
    }

    private void fetchList()
    {
        String query = searchView.getQuery().toString();
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
                        adapter.notifyDataSetChanged();
                    }
                }

                @Override
                public void onFailure(Call<ArrayList<PostModel>> call, Throwable t) {
                    System.err.println("We goofed no search");
                }
            });
        }
        else
        {
            // Set up our search argument
            PostSearchModel psm = new PostSearchModel();
            psm.query = query;
            psm.offset = currentPostStart;
            psm.limit = POSTS_PER_PAGE;
            Call<SearchReturnModel> call = MainActivity.api.doSearchPost(psm);
            call.enqueue(new Callback<SearchReturnModel>() {
                @Override
                public void onResponse(Call<SearchReturnModel> call, Response<SearchReturnModel> response) {
                    // If we got
                    if (response.isSuccessful()) {
                        posts.clear();
                        SearchReturnModel srm = response.body();
                        posts.addAll(srm.results);
                        adapter.notifyDataSetChanged();
                    }
                }

                @Override
                public void onFailure(Call<SearchReturnModel> call, Throwable t) {
                    System.err.println("We goofed search");
                }
            });
        }
    }

    public void addPostAction(View view)
    {}

    public void nextPageAction(View view)
    {
        System.out.println("  DEBUG: in nextPageAction");
        currentPostStart += POSTS_PER_PAGE;
        fetchList();
    }
    public void prevPageAction(View view)
    {
        System.out.println("  DEBUG: in prevPageAction");
        currentPostStart -= POSTS_PER_PAGE;
        if (currentPostStart < 0)
            currentPostStart = 0;
        fetchList();
    }
    public void firstPageAction(View view)
    {
        System.out.println("  DEBUG: in firstPageAction");
        currentPostStart = 0;
        fetchList();
    }
}