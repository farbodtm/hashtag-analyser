package hashtag;

import hashtag.Database;

import java.util.List;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Database db = new Database();
        Map<String, List<Integer>> hashtags = db.getHashtags(10);
    }
}
