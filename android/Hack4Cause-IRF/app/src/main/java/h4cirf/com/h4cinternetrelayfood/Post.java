package h4cirf.com.h4cinternetrelayfood;


import android.graphics.Bitmap;

import java.util.ArrayList;

import h4cirf.com.h4cinternetrelayfood.models.PostModel;

public class Post {
    public String foodType;
    public String postDescription;
    public String weight;
    public String expiry = "Never";
    public String location;
    public String contactInfo;
    public boolean isPackaged;
    //ArrayList<Bitmap> images;
    public String comments;
    public long postID;
    public long userID;
    public ArrayList<String> eligibility;
}
