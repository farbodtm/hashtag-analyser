package hashtag;

import hashtag.Database;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        Database db = new Database();
        List<Hashtag> hashtags = db.getHashtags(200);

        System.out.println(hashtags);

        KSCClustering clustering = new KSCClustering(hashtags);
        clustering.run(6);

        System.out.println(hashtags);

        db.saveHashtags(clustering.hashtags, clustering.centroids);
    }
}
