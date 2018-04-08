package h4cirf.com.h4cinternetrelayfood;

import android.support.design.widget.TextInputEditText;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.Spinner;

import java.util.ArrayList;
import java.util.Arrays;

import h4cirf.com.h4cinternetrelayfood.models.PostModel;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EditPostActivity extends AppCompatActivity {
    Spinner             foodTypeSpinner;
    TextInputEditText   quantityText;
    TextInputEditText   pickupTimesText;
    TextInputEditText   addressText;
    TextInputEditText   contactInfoText;
    TextInputEditText   expirationText;
    TextInputEditText   descriptionText;
    Spinner             readinessSpinner;
    Spinner             statusSpinner;
    TextInputEditText   commentText;
    PostModel currentPost;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_post);

        // Get our current post
        currentPost = getIntent().getExtras().getParcelable(MainActivity.POST_MODEL);

        //Get forms
        foodTypeSpinner     = findViewById(R.id.reusableEditFoodType);
        quantityText        = findViewById(R.id.reusableEditQuantityText);
        pickupTimesText     = findViewById(R.id.reusableEditPickupTimeText);
        addressText         = findViewById(R.id.reusableEditAddressText);
        contactInfoText     = findViewById(R.id.reusableEditContactInfoText);
        expirationText      = findViewById(R.id.reusableEditExpirationText);
        descriptionText     = findViewById(R.id.reusableEditDescriptionText);
        readinessSpinner    = findViewById(R.id.reusableEditReadiness);
        statusSpinner       = findViewById(R.id.reusableEditStatus);
        commentText         = findViewById(R.id.reusableEditCommentText);
        // Set their values
        //NYI
        //ArrayList<String> foodTypeArr = new ArrayList<>(Arrays.asList(getResources().getStringArray(R.array.foodTypes_spinner_array)));
        //foodTypeSpinner.setSelection(foodTypeArr.indexOf(currentPost.foodtype));
        quantityText.setText(currentPost.amount);
        pickupTimesText.setText(currentPost.pickupWindow);
        addressText.setText(currentPost.pickupAddress);
        contactInfoText.setText(currentPost.email);
        //NYI
        expirationText.setText("Never");
        descriptionText.setText(currentPost.title);
        ArrayList<String> readinessArr = new ArrayList<>(Arrays.asList(getResources().getStringArray(R.array.readiness_spinner_array)));
        readinessSpinner.setSelection(readinessArr.indexOf(currentPost.readiness));
        ArrayList<String> statusArr = new ArrayList<>(Arrays.asList(getResources().getStringArray(R.array.status_spinner_array)));
        statusSpinner.setSelection((statusArr.indexOf(currentPost.status)));
        commentText.setText(currentPost.description);

        View root = findViewById(R.id.addPostRoot);
        root.requestFocus();
    }

    /**
     * AddPostButton action
     * Checks that the current information is formatted validly and is then submitted
     * @param view
     */
    public void submitAction(View view)
    {
        //*****Formatting Checks*****
        boolean succeeded = true;
        PostModel post = new PostModel();
        // NYI on PostModel in Database
        String foodType = foodTypeSpinner.getSelectedItem().toString();
        post.amount = quantityText.getText().toString();
        if(post.amount.isEmpty())
        {
            quantityText.setError("Quantity must not be blank");
            succeeded = false;
        }
        if(!isNumeric(post.amount) || Double.valueOf(post.amount) < 0.0)
        {
            quantityText.setError("Quantity must be a number greater than 0");
            succeeded = false;
        }
        post.pickupWindow = pickupTimesText.getText().toString();
        if(post.pickupWindow.isEmpty())
        {
            pickupTimesText.setError("Pickup window must not be blank");
            succeeded = false;
        }
        post.pickupAddress = addressText.getText().toString();
        if(post.pickupAddress.isEmpty())
        {
            addressText.setError("Address must not be blank");
            succeeded = false;
        }
        // NYI on PostModel in Database
        String contactInfo = contactInfoText.getText().toString();
        post.email = EntryActivity.userProfile.getEmail();
        // NYI on PostModel in Database
        String expiration = expirationText.getText().toString();
        post.title = descriptionText.getText().toString();
        if(post.title.isEmpty())
        {
            descriptionText.setError("Description must not be blank");
            succeeded = false;
        }
        post.readiness = readinessSpinner.getSelectedItem().toString();
        if(post.readiness.equals("Select food readiness"))
        {
            //Error somehow
            succeeded = false;
        }
        post._id = currentPost._id;
        post.status = statusSpinner.getSelectedItem().toString();
        post.description = commentText.getText().toString();

        //*****Launch on Success*****
        if(succeeded)
        {
            // Add the new post to the database and return to our main activity regardless of
            // success
            MainActivity.api.doPutPost(post._id, MainActivity.tokenID, post).enqueue(new Callback<Void>() {
                @Override
                public void onResponse(Call<Void> call, Response<Void> response) {
                    returnToMain(true);
                }

                @Override
                public void onFailure(Call<Void> call, Throwable t) {
                    returnToMain(false);
                }
            });
        }
    }

    private boolean isNumeric(String str)
    {
        try
        {
            double d = Double.parseDouble(str);
            return true;
        }
        catch(NumberFormatException e)
        {
            return false;
        }
    }

    private void returnToMain(boolean success)
    {
        setResult((success) ? RESULT_OK : RESULT_CANCELED);
        finish();
    }
}
