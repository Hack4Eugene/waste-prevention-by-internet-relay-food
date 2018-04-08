package h4cirf.com.h4cinternetrelayfood;


import android.content.Context;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.ArrayList;

import h4cirf.com.h4cinternetrelayfood.models.PostModel;

public class PostListAdapter extends ArrayAdapter<PostModel> {
    public PostListAdapter(Context context, ArrayList<PostModel> posts) {
        super(context, 0, posts);
    }

    public PostListAdapter(Context context, int viewResource, ArrayList<PostModel> posts) {
        super(context, viewResource, posts);
    }

    @NonNull
    @Override
    public View getView(int position, View convertView, @NonNull ViewGroup parent) {
        // Get the data item for this position
        PostModel post = getItem(position);
        // Check if an existing view is being reused, otherwise inflate the view
        if (convertView == null) {
            convertView = LayoutInflater.from(getContext()).inflate(R.layout.post_list_item, parent, false);
        }
        // Lookup view for data population
        TextView postType = convertView.findViewById(R.id.postListFoodTypeText);
        TextView postDescription = convertView.findViewById(R.id.postListDescription);
        TextView postWeight = convertView.findViewById(R.id.postListWeight);
        TextView postExpiry = convertView.findViewById(R.id.postListExpiry);
        // Populate the data into the template view using the data object
        postType.setText("Food");
        postDescription.setText(post.title);
        postWeight.setText(post.amount);
        postExpiry.setText("Never");

        // Return the completed view to render on screen
        return convertView;
    }
}
