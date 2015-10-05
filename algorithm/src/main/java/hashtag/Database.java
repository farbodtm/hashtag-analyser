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

import java.util.List;
import java.util.Set;

import static java.util.concurrent.TimeUnit.SECONDS;

public class Database {
  public static void main(String[] args) {
    MongoClient mongo = new MongoClient("localhost", 27017);
    DB db = mongo.getDB("hashtag");

    Set<String> collectionNames = db.getCollectionNames();
    for (final String s : collectionNames) {
      //System.out.println(s);
    }

    DBCollection hashtag = db.getCollection("hashtag_mapreduce");
    DBObject test = hashtag.findOne();
    //System.out.println(test);
    mongo.close();
  }
}
