package h4cirf.com.h4cinternetrelayfood;

import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.design.widget.TextInputEditText;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.Spinner;

import java.util.ArrayList;
import java.util.Calendar;

import h4cirf.com.h4cinternetrelayfood.models.PostModel;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AddPostActivity extends AppCompatActivity {
    public static String tokenID;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_post);

        tokenID = getIntent().getStringExtra("token");
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
        //Bring up our views (in list order)
        Spinner             foodTypeSpinner     = findViewById(R.id.reusableEditFoodType);
        TextInputEditText   quantityText        = findViewById(R.id.reusableEditQuantityText);
        TextInputEditText   pickupTimesText     = findViewById(R.id.reusableEditPickupTimeText);
        TextInputEditText   addressText         = findViewById(R.id.reusableEditAddressText);
        TextInputEditText   contactInfoText     = findViewById(R.id.reusableEditContactInfoText);
        TextInputEditText   expirationText      = findViewById(R.id.reusableEditExpirationText);
        TextInputEditText   descriptionText     = findViewById(R.id.reusableEditDescriptionText);
        Spinner             readinessSpinner    = findViewById(R.id.reusableEditReadiness);
        Spinner             statusSpinner       = findViewById(R.id.reusableEditStatus);
        TextInputEditText   commentText         = findViewById(R.id.reusableEditCommentText);
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
        post.status = statusSpinner.getSelectedItem().toString();
        post.description = commentText.getText().toString();

        //*****Launch on Success*****
        if(succeeded)
        {
            post.creationDate = Calendar.getInstance().getTime();
            post.eligibility = new ArrayList<>();
            // Add the new post to the database and return to our main activity regardless of
            // success
            System.out.println("DEBUG: Token: " + tokenID);
            MainActivity.api.doPostPost(tokenID, post).enqueue(new Callback<Void>() {
                @Override
                public void onResponse(Call<Void> call, Response<Void> response) {
                    returnToMain(true);
                }

                @Override
                public void onFailure(Call<Void> call, Throwable t) {
                    System.err.println(" DEBUG: Failed: is tokenID null: " + (tokenID == null));
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
