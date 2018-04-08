package h4cirf.com.h4cinternetrelayfood.models;


import android.os.Parcel;
import android.os.Parcelable;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class PostModel implements Parcelable{
    public String _id; // Don't fill out this
    public String creationDate;
    public String email;
    public String title;
    public String status;
    public List<String> eligibility;
    public String amount;
    public String readiness;
    public String description;
    public String pickupWindow;
    public String pickupAddress;

    @Override
    public int describeContents()
    {
        return 0;
    }

    public void writeToParcel(Parcel out, int flags) {
        out.writeString(_id);
        out.writeString(creationDate);
        out.writeString(email);
        out.writeString(title);
        out.writeString(status);
        out.writeArray(eligibility.toArray());
        out.writeString(amount);
        out.writeString(readiness);
        out.writeString(description);
        out.writeString(pickupWindow);
        out.writeString(pickupAddress);
    }

    public PostModel()
    {
        eligibility = new ArrayList<>();
    }

    public static final Parcelable.Creator<PostModel> CREATOR
            = new Parcelable.Creator<PostModel>() {
        public PostModel createFromParcel(Parcel in) {
            return new PostModel(in);
        }

        public PostModel[] newArray(int size) {
            return new PostModel[size];
        }
    };

    private PostModel(Parcel in) {
        _id = in.readString();
        DateFormat formatter = DateFormat.getDateInstance();
        creationDate = in.readString();
        email = in.readString();
        title = in.readString();
        status = in.readString();
        eligibility = new ArrayList<>();
        List<Object> objects = Arrays.asList(in.readArray(String.class.getClassLoader()));
        for(Object o : objects)
            eligibility.add(o != null ? o.toString() : null);
        amount = in.readString();
        readiness = in.readString();
        description = in.readString();
        pickupWindow = in.readString();
        pickupAddress = in.readString();
    }
}
