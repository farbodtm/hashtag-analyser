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
    public List<Hashtag> getHashtags(int limit) {
        MongoClient mongo = new MongoClient("localhost", 27017);
        DB db = mongo.getDB("hashtag");

        DBCollection hashtagCollection = db.getCollection("hashtags");
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
}
