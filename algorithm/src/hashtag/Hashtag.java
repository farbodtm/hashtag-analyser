package hashtag;

import java.util.List;

/**
 * Class Hashtag
 *
 * Representing a hashtag which contains its text, temporal data, and the cluster it belongs to
 *
 */
public class Hashtag {
    public String text;
    public List<Double> temporal;

    public int cluster;

    public String toString() {
        return text + " belongs to " + String.valueOf(cluster);
    }

    public Hashtag() {
        cluster = -1;
    }
}
