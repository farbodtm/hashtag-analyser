package hashtag;

import hashtag.Database;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        if (args.length < 4) {
            System.out.print("<collection_name> <number of hashtags (0 = all)> <number of clusters> <number of iterations>");
            System.exit(1);
        }
        Database db = new Database(args[0]);
        List<Hashtag> hashtags = db.getHashtags(Integer.parseInt(args[1]));

        //System.out.println(hashtags);

        KSCClustering clustering = new KSCClustering(hashtags);
        clustering.run(Integer.parseInt(args[2]), Integer.parseInt(args[3]));

        //System.out.println(hashtags);

        db.saveHashtags(clustering.hashtags, clustering.centroids, args[1], args[2]);
    }
}
