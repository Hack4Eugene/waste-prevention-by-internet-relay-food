package h4cirf.com.h4cinternetrelayfood;

import java.util.ArrayList;

import h4cirf.com.h4cinternetrelayfood.models.PostModel;
import h4cirf.com.h4cinternetrelayfood.models.PostSearchModel;
import h4cirf.com.h4cinternetrelayfood.models.SearchReturnModel;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;
import retrofit2.http.Query;

interface APIInterface {

    /**
     * Gets the list of most recent posts
     */
    @GET("/posts")
    Call<ArrayList<PostModel>> doGetListResources(@Query("offset") int offset, @Query("limit") int limit);

    @POST("/posts")
    Call<Void> doPostPost(@Header("Authorization") String authToken, @Body PostModel postModel);

    @PUT("/posts/{postid}")
    Call<Void> doPutPost(@Path("postid") String postID, @Header("Authorization") String authToken, @Body PostModel postModel);

    @POST("/posts/search")
    Call<SearchReturnModel> doSearchPost(@Body PostSearchModel searchModel);
}
