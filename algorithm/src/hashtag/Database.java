package hashtag;

import com.mongodb.MongoClient;
import com.mongodb.MongoException;
import com.mongodb.WriteConcern;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.DBCursor;
import com.mongodb.ServerAddress;

import javax.swing.text.DateFormatter;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.time.LocalDate;

import static java.util.concurrent.TimeUnit.SECONDS;

public class Database {
    public Map<String, List<Integer>> getHashtags(int limit) {
        MongoClient mongo = new MongoClient("localhost", 27017);
        DB db = mongo.getDB("hashtag");

        DBCollection hashtag = db.getCollection("hashtags");
        DBCursor cursor = hashtag.find().sort(new BasicDBObject("value.total", -1)).limit(limit);


        Map<String, List<Integer>> hashtags = new HashMap<>();

        DBObject obj;
        while(cursor.hasNext()) {
            obj = cursor.next();

            LocalDate start = LocalDate.of(2015, 8, 19);
            LocalDate end = LocalDate.of(2015, 9, 8);
            DateTimeFormatter format = DateTimeFormatter.ofPattern("E MMM dd yyyy");

            String hashtagText = (String)((DBObject)obj.get("value")).get("text");
            DBObject temporal = (DBObject)((DBObject)obj.get("value")).get("temporal");

            List<Integer> tmp = new ArrayList<>();
            for (int i = 0; !start.equals(end); i++) {
                String date = start.format(format);
                Double occuranceObj = (Double) temporal.get(date);
                Integer occurance = occuranceObj == null ? 0 : occuranceObj.intValue();
                tmp.add(occurance);

                start = start.plus(1, ChronoUnit.DAYS);
            }
            hashtags.put(hashtagText, tmp);
        }
        System.out.println(hashtags);

        mongo.close();
        return hashtags;
    }
}
