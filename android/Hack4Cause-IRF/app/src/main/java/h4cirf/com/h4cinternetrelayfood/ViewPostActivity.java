package h4cirf.com.h4cinternetrelayfood;

import android.content.Intent;
import android.support.design.widget.TextInputEditText;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;

import java.util.ArrayList;
import java.util.Arrays;

import h4cirf.com.h4cinternetrelayfood.models.PostModel;

public class ViewPostActivity extends AppCompatActivity {
    EditText            foodTypeText;
    TextInputEditText   quantityText;
    TextInputEditText   pickupTimesText;
    TextInputEditText   addressText;
    TextInputEditText   contactInfoText;
    TextInputEditText   expirationText;
    TextInputEditText   descriptionText;
    EditText            readinessText;
    EditText            statusText;
    TextInputEditText   commentText;
    PostModel currentPost;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_post);


        // Get our current post
        currentPost = getIntent().getExtras().getParcelable(MainActivity.POST_MODEL);

        //Get forms
        foodTypeText        = findViewById(R.id.reusableEditFoodTypeTextNE);
        quantityText        = findViewById(R.id.reusableEditQuantityTextNE);
        pickupTimesText     = findViewById(R.id.reusableEditPickupTimeTextNE);
        addressText         = findViewById(R.id.reusableEditAddressTextNE);
        contactInfoText     = findViewById(R.id.reusableEditContactInfoTextNE);
        expirationText      = findViewById(R.id.reusableEditExpirationTextNE);
        descriptionText     = findViewById(R.id.reusableEditDescriptionTextNE);
        readinessText       = findViewById(R.id.reusableEditReadinessTextNE);
        statusText          = findViewById(R.id.reusableEditStatusTextNE);
        commentText         = findViewById(R.id.reusableEditCommentTextNE);
        // Set their values
        //NYI
        foodTypeText.setText("Meal");
        quantityText.setText(currentPost.amount);
        pickupTimesText.setText(currentPost.pickupWindow);
        addressText.setText(currentPost.pickupAddress);
        contactInfoText.setText(currentPost.email);
        //NYI
        expirationText.setText("Never");
        descriptionText.setText(currentPost.title);
        readinessText.setText(currentPost.readiness);
        statusText.setText(currentPost.status);
        commentText.setText(currentPost.description);

        // Switch the button functionality and text if we're the poster
        if(currentPost.email != null && currentPost.email.equals(EntryActivity.userProfile.getEmail()))
        {
            Button button = findViewById(R.id.ContactButton);
            button.setText(R.string.start_edit_post);
            button.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    editAction(v);
                }
            });
        }

        // Set our views to be not editable
        foodTypeText.setTag(foodTypeText.getKeyListener());
        foodTypeText.setKeyListener(null);
        quantityText.setTag(quantityText.getKeyListener());
        quantityText.setKeyListener(null);
        pickupTimesText.setTag(pickupTimesText.getKeyListener());
        pickupTimesText.setKeyListener(null);
        addressText.setTag(addressText.getKeyListener());
        addressText.setKeyListener(null);
        contactInfoText.setTag(contactInfoText.getKeyListener());
        contactInfoText.setKeyListener(null);
        expirationText.setTag(expirationText.getKeyListener());
        expirationText.setKeyListener(null);
        descriptionText.setTag(descriptionText.getKeyListener());
        descriptionText.setKeyListener(null);
        readinessText.setTag(readinessText.getKeyListener());
        readinessText.setKeyListener(null);
        statusText.setTag(statusText.getKeyListener());
        statusText.setKeyListener(null);
        commentText.setTag(commentText.getKeyListener());
        commentText.setKeyListener(null);

        View root = findViewById(R.id.addPostRoot);
        root.requestFocus();
    }

    /**
     * Start editing this post in the EditPostActivity
     * @param view
     */
    public void editAction(View view)
    {
        Intent intent = new Intent(this, EditPostActivity.class);
        intent.putExtra(MainActivity.POST_MODEL, currentPost);
        // TODO start waiting for result and refresh post after edit
        startActivity(intent);
    }

    public void contactAction(View view)
    {
    }
}
