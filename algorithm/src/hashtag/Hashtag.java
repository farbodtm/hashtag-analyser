package hashtag;

import java.util.List;

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
