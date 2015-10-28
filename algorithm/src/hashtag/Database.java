package hashtag;

import com.mongodb.MongoClient;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.DBCursor;

import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Database {
    private String collection;
    public Database(String name) {
        collection = name;
    }
    public List<Hashtag> getHashtags(int limit) {
        MongoClient mongo = new MongoClient("localhost", 27017);
        DB db = mongo.getDB("hashtag");

        DBCollection hashtagCollection = db.getCollection(collection);
        DBCursor cursor;
        if (limit == 0) {
            cursor = hashtagCollection.find();
        } else {
            cursor = hashtagCollection.find().sort(new BasicDBObject("value.total", -1)).limit(limit);
        }


        List<Hashtag> hashtags = new ArrayList<>();

        DBObject obj;
        Hashtag hashtag;
        while(cursor.hasNext()) {
            obj = cursor.next();
            hashtag = new Hashtag();
            hashtag.text = (String)((DBObject)obj.get("value")).get("text");
            hashtag.temporal = (List<Double>)((DBObject)obj.get("value")).get("temporalArr");
            hashtags.add(hashtag);
        }

        mongo.close();
        return hashtags;
    }
    public boolean saveHashtags(List<Hashtag> hashtags, List<Hashtag> clusters, String numHashtags, String numClusters) {
        MongoClient mongo = new MongoClient("localhost", 27017);
        DB db = mongo.getDB("hashtag");
        DBCollection hashtagCollection = db.getCollection(collection + "_clustered_" + numHashtags + "_" + numClusters);
        hashtagCollection.remove(new BasicDBObject());
        for (Hashtag hashtag : hashtags) {
            BasicDBObject doc = new BasicDBObject("text", hashtag.text)
                    .append("cluster", hashtag.cluster)
                    .append("temporal", hashtag.temporal);
            hashtagCollection.insert(doc);
        }

        DBCollection clusterCollection = db.getCollection(collection + "_clusters_" + numHashtags + "_" + numClusters);
        clusterCollection.remove(new BasicDBObject());
        for (int i = 0; i < clusters.size(); i++) {
            BasicDBObject doc = new BasicDBObject("index", i)
                    .append("temporal", clusters.get(i).temporal);
            clusterCollection.insert(doc);
        }

        mongo.close();
        return true;
    }
}
