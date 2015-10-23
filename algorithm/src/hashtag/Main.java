package hashtag;

import hashtag.Database;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        Database db = new Database();
        //Map<String, List<Double>> hashtags = db.getHashtags(0);
        //List< List<Double> > temporal = new  ArrayList< List<Double> >(hashtags.values());

        KSCClustering clustering = new KSCClustering();
        clustering.computeCentral(2);

        //double distance = clustering.distance(temporal.get(0), temporal.get(1));
    }
}
